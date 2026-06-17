import { orderApi } from "@/lib/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderID: string) => {
      const response = await orderApi.updatePaymentStatusApi(
        orderID,
        "completed",
        "paid",
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to update payment");
      }

      return response.data;
    },

    onSuccess: () => {
      toast({
        title: "Update Payment Status",
        description: `Payment marked as paid`,
      });

      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark payment.",
      });
    },
  });
};
