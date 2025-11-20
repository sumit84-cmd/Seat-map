// src/data/venue.js
export const data = {
    venueId: "arena-01",
    name: "Metropolis Arena",
    map: {
        width: 1024,
        height: 768
    },
    sections: [
        {
            id: "A",
            label: "Section - A",
            transform: {
                x: 0,
                y: 0,
                scale: 1
            },
            rows: [
                {
                    index: 1,
                    seats: [
                        { id: "A-1-01", col: 1, x: 50, y: 40, priceTier: 1, status: "available" },
                        { id: "A-1-02", col: 2, x: 100, y: 40, priceTier: 1, status: "available" },
                        { id: "A-1-03", col: 3, x: 150, y: 40, priceTier: 1, status: "sold" },
                        { id: "A-1-04", col: 4, x: 200, y: 40, priceTier: 1, status: "available" },
                        { id: "A-1-05", col: 5, x: 250, y: 40, priceTier: 1, status: "reserved" },
                        { id: "A-1-06", col: 6, x: 300, y: 40, priceTier: 1, status: "available" },
                        { id: "A-1-07", col: 7, x: 350, y: 40, priceTier: 1, status: "available" }
                    ]
                },
                {
                    index: 2,
                    seats: [
                        { id: "A-2-01", col: 1, x: 50, y: 90, priceTier: 1, status: "available" },
                        { id: "A-2-02", col: 2, x: 100, y: 90, priceTier: 1, status: "held" },
                        { id: "A-2-03", col: 3, x: 150, y: 90, priceTier: 1, status: "available" },
                        { id: "A-2-04", col: 4, x: 200, y: 90, priceTier: 1, status: "available" },
                        { id: "A-2-05", col: 5, x: 250, y: 90, priceTier: 1, status: "sold" },
                        { id: "A-2-06", col: 6, x: 300, y: 90, priceTier: 1, status: "available" },
                        { id: "A-2-07", col: 7, x: 350, y: 90, priceTier: 1, status: "available" }
                    ]
                },
                {
                    index: 3,
                    seats: [
                        { id: "A-3-01", col: 1, x: 50, y: 140, priceTier: 1, status: "available" },
                        { id: "A-3-02", col: 2, x: 100, y: 140, priceTier: 1, status: "available" },
                        { id: "A-3-03", col: 3, x: 150, y: 140, priceTier: 1, status: "reserved" },
                        { id: "A-3-04", col: 4, x: 200, y: 140, priceTier: 1, status: "available" },
                        { id: "A-3-05", col: 5, x: 250, y: 140, priceTier: 1, status: "available" },
                        { id: "A-3-06", col: 6, x: 300, y: 140, priceTier: 1, status: "held" },
                        { id: "A-3-07", col: 7, x: 350, y: 140, priceTier: 1, status: "available" }
                    ]
                },
                {
                    index: 4,
                    seats: [
                        { id: "A-4-01", col: 1, x: 50, y: 190, priceTier: 1, status: "sold" },
                        { id: "A-4-02", col: 2, x: 100, y: 190, priceTier: 1, status: "available" },
                        { id: "A-4-03", col: 3, x: 150, y: 190, priceTier: 1, status: "available" },
                        { id: "A-4-04", col: 4, x: 200, y: 190, priceTier: 1, status: "held" },
                        { id: "A-4-05", col: 5, x: 250, y: 190, priceTier: 1, status: "available" },
                        { id: "A-4-06", col: 6, x: 300, y: 190, priceTier: 1, status: "available" },
                        { id: "A-4-07", col: 7, x: 350, y: 190, priceTier: 1, status: "reserved" }
                    ]
                },
                {
                    index: 5,
                    seats: [
                        { id: "A-5-01", col: 1, x: 50, y: 240, priceTier: 1, status: "available" },
                        { id: "A-5-02", col: 2, x: 100, y: 240, priceTier: 1, status: "available" },
                        { id: "A-5-03", col: 3, x: 150, y: 240, priceTier: 1, status: "reserved" },
                        { id: "A-5-04", col: 4, x: 200, y: 240, priceTier: 1, status: "sold" },
                        { id: "A-5-05", col: 5, x: 250, y: 240, priceTier: 1, status: "available" },
                        { id: "A-5-06", col: 6, x: 300, y: 240, priceTier: 1, status: "available" },
                        { id: "A-5-07", col: 7, x: 350, y: 240, priceTier: 1, status: "available" }
                    ]
                }
            ]
        }
    ]
};