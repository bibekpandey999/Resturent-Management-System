import { ticketApi } from "@/lib/api/ticket.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

type TicketStatus = "pending" | "served" | "cancelled" | "completed";

type UpdateTicketStatusPayload = {
  ticketID: string;
  status: TicketStatus;
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketID, status }: UpdateTicketStatusPayload) => {
      const response = await ticketApi.updateticketStatusApi(ticketID, status);

      if (!response.success) {
        throw new Error(response.error || "Failed to update order");
      }

      return response.data;
    },

    onSuccess: (_, variables) => {
      toast({
        title: "Update Order Status",
        description: `Order marked as ${variables.status}`,
      });

      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark order.",
      });
    },
  });
};
