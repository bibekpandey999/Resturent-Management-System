import OrderModel, { IOrder } from "../model/order.model";

class OrderRepository {
  private model;

  constructor() {
    this.model = OrderModel;
  }

  async create(data: Partial<IOrder>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating order: ${error}`);
    }
  }

  async getAll({
    skip,
    limit,
    status,
    tableId,
    search,
  }: {
    skip: number;
    limit: number;
    status?: string;
    tableId?: string;
    search?: string;
  }) {
    try {
      const query: any = {};

      if (status && status !== "all") {
        query.status = status;
      }

      if (tableId) {
        query.tableId = tableId;
      }

      if (search) {
        query.$or = [
          {
            orderNumber: {
              $regex: search,
              $options: "i",
            },
          },
          {
            customerName: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      const data = await this.model
        .find(query)
        .populate("tableId")
        .populate("waiterId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return {
        data,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching orders: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model
        .findById(id)
        .populate("tableId")
        .populate("waiterId");
    } catch (error) {
      throw new Error(`Error fetching order: ${error}`);
    }
  }

  async getByOrderNumber(orderNumber: string) {
    try {
      return await this.model.findOne({
        orderNumber,
      });
    } catch (error) {
      throw new Error(`Error fetching order: ${error}`);
    }
  }

  async getActiveOrderByTable(tableId: string) {
    try {
      return await this.model
        .findOne({
          tableId,
          status: "active",
        })
        .populate("tableId")
        .populate("waiterId");
    } catch (error) {
      throw new Error(`Error fetching active order: ${error}`);
    }
  }

  async update(id: string, data: Partial<IOrder>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Error updating order: ${error}`);
    }
  }

  async updateStatus(
    ticketId: string,
    status: "active" | "completed" | "cancelled" | undefined,
    paymentStatus: "pending" | "paid" | "partial" | undefined,
  ) {
    try {
      return await this.model.findByIdAndUpdate(
        ticketId,
        {
          status,
          paymentStatus,
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error(`Error updating ticket status: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting order: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting orders: ${error}`);
    }
  }

  async generateOrderNumber() {
    try {
      const latestOrder = await this.model.findOne().sort({ createdAt: -1 });

      if (!latestOrder) {
        return "ORD-000001";
      }

      const currentNumber = latestOrder.orderNumber?.replace("ORD-", "") || "0";

      const nextNumber = Number(currentNumber) + 1;

      return `ORD-${String(nextNumber).padStart(6, "0")}`;
    } catch (error) {
      throw new Error(`Error generating order number: ${error}`);
    }
  }

  async completeOrder(id: string) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        {
          status: "completed",
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error(`Error completing order: ${error}`);
    }
  }

  async markAsPaid(id: string) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        {
          paymentStatus: "paid",
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error(`Error updating payment: ${error}`);
    }
  }

  async getActiveOrders() {
    try {
      return await this.model
        .find({
          status: "active",
        })
        .populate("tableId")
        .populate("waiterId")
        .sort({
          createdAt: -1,
        });
    } catch (error) {
      throw new Error(`Error fetching active orders: ${error}`);
    }
  }

  async getDashboardStats() {
    try {
      const now = new Date();

      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );

      const previousMonthEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
      );

      const [currentMonthStats, previousMonthStats, activeOrders] =
        await Promise.all([
          this.model.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: currentMonthStart,
                },
                status: {
                  $ne: "cancelled",
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: "$totalAmount",
                },
                totalOrders: {
                  $sum: 1,
                },
              },
            },
          ]),

          this.model.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: previousMonthStart,
                  $lte: previousMonthEnd,
                },
                status: {
                  $ne: "cancelled",
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: "$totalAmount",
                },
                totalOrders: {
                  $sum: 1,
                },
              },
            },
          ]),

          this.model.countDocuments({
            status: "active",
          }),
        ]);

      return {
        currentMonth: currentMonthStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
        },

        previousMonth: previousMonthStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
        },

        activeOrders,
      };
    } catch (error) {
      throw new Error(`Error fetching dashboard stats: ${error}`);
    }
  }

  async getRevenueChart(period: "7d" | "30d" | "90d" | "1y" | "all") {
    try {
      const now = new Date();

      let startDate: Date | null = null;

      switch (period) {
        case "7d":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;

        case "30d":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 30);
          break;

        case "90d":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 90);
          break;

        case "1y":
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;

        case "all":
          startDate = null;
          break;
      }

      const matchStage: any = {
        status: {
          $ne: "cancelled",
        },
      };

      if (startDate) {
        matchStage.createdAt = {
          $gte: startDate,
        };
      }

      const groupFormat =
        period === "1y" || period === "all" ? "%Y-%m" : "%Y-%m-%d";

      return await this.model.aggregate([
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: "$createdAt",
              },
            },
            revenue: {
              $sum: "$subtotal",
            },
            orders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
    } catch (error) {
      throw new Error(`Error fetching revenue chart: ${error}`);
    }
  }
}

export default new OrderRepository();
