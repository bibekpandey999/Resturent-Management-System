import { AppRouteQueryImplementation } from "@ts-rest/express";
import reservationRepository from "../../repository/reservation.repository";
import { reservationContract } from "../../contract/reservation/reservation.contract";

export const mapReservation = (reservation: any) => {
  return {
    _id: reservation._id.toString(),
    customerName: reservation.customerName,
    customerPhone: reservation.customerPhone,
    date: reservation.date,
    time: reservation.time,
    partySize: reservation.partySize,

    tableId: reservation.tableId?._id?.toString() ?? null,

    table: reservation.tableId
      ? {
          _id: reservation.tableId._id?.toString(),
          name: reservation.tableId.name,
          capacity: reservation.tableId.capacity,
          status: reservation.tableId.status,
        }
      : null,

    status: reservation.status,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
  };
};

export const getAllReservation: AppRouteQueryImplementation<
  typeof reservationContract.getAllReservation
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    const { data, total } = await reservationRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
      status: req.query.status as string,
      date: req.query.date as string,
    });

    const formattedData = data.map(mapReservation);

    return {
      status: 200,
      body: {
        data: formattedData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch reservations",
      },
    };
  }
};

export const getReservationByID: AppRouteQueryImplementation<
  typeof reservationContract.getReservationByID
> = async ({ req }) => {
  try {
    const reservation = await reservationRepository.getByID(req.params.reservationId);

    if (!reservation) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Reservation not found",
        },
      };
    }

    return {
      status: 200,
      body: mapReservation(reservation),
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const getReservationStats: AppRouteQueryImplementation<
  typeof reservationContract.getReservationStats
> = async () => {
  const stats = await reservationRepository.getStats();

  return {
    status: 200,
    body: stats,
  };
};

export const reservationQueryHandler = {
  getAllReservation,
  getReservationByID,
  getReservationStats,
};
