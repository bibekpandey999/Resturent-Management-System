"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRouter = void 0;
const express_1 = require("@ts-rest/express");
const reservation_mutation_1 = require("./reservation.mutation");
const reservation_query_1 = require("./reservation.query");
const reservation_contract_1 = require("../../contract/reservation/reservation.contract");
const s = (0, express_1.initServer)();
exports.reservationRouter = s.router(reservation_contract_1.reservationContract, {
    createReservation: reservation_mutation_1.reservationMutationHandler.createReservation,
    updateReservation: reservation_mutation_1.reservationMutationHandler.updateReservation,
    deleteReservation: reservation_mutation_1.reservationMutationHandler.deleteReservation,
    getAllReservation: reservation_query_1.reservationQueryHandler.getAllReservation,
    getReservationByID: reservation_query_1.reservationQueryHandler.getReservationByID,
    getReservationStats: reservation_query_1.reservationQueryHandler.getReservationStats,
});
