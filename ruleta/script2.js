class Room {
    constructor(id, name, maxParticipants, amount, closingDate) {
        this.id = id;
        this.name = name;
        this.maxParticipants = maxParticipants;
        this.amount = amount;
        this.closingDate = closingDate;
        this.participants = [];
        this.status = "active";
        this.winner = null;
    }
}

class LotterySystem {
    constructor() {
        this.rooms = [];
        this.init();
    }

    init() {
        const form = document.getElementById("registerForm");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                this.registerParticipant();
            });
        }

        const closeBtn = document.getElementById("closeModal");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.closeModal());
        }

        this.loadRooms();
        this.renderRooms();
        this.updateRoomSelect();
        this.startTimers();
    }

    loadRooms() {
        this.rooms = [
            new Room(1, "Sala A", 10, 100, new Date(Date.now() + 60000 * 2)),
            new Room(2, "Sala B", 5, 50, new Date(Date.now() + 60000 * 3)),
        ];
    }

    registerParticipant() {
        const name = document.getElementById("participantName").value.trim();
        const roomId = parseInt(document.getElementById("roomSelect").value);

        if (!name || !roomId) {
            this.showNotification("Por favor completa todos los campos", "error");
            return;
        }

        const room = this.rooms.find((r) => r.id === roomId);
        if (!room) return;

        if (room.status !== "active") return;
        if (room.participants.length >= room.maxParticipants) return;
        if (room.participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;

        const participant = {
            id: Date.now(),
            name,
            number: room.participants.length + 1,
            joinedAt: new Date(),
        };

        room.participants.push(participant);
        this.renderRooms();
        this.updateRoomSelect();
        document.getElementById("registerForm").reset();

        this.showNotification(
            `Participante "${participant.name}" registrado en la sala "${room.name}"`,
            "success"
        );
    }

    renderRooms() {
        const container = document.getElementById("roomsContainer");
        if (!container) return;

        container.innerHTML = this.rooms
            .map(
                (room) => `
            <div class="room-card ${room.status}">
                <h3>${room.name}</h3>
                <p>Cupo: ${room.participants.length}/${room.maxParticipants}</p>
                <p>Monto: $${room.amount}</p>
                <p>Cierra: ${room.closingDate.toLocaleString()}</p>
                <p>Estado: ${room.status === "active" ? "Activo ✅" : "Cerrado ❌"}</p>
                <ul>
                    ${room.participants
                        .map((p) => `<li>#${p.number} - ${p.name}</li>`)
                        .join("")}
                </ul>
                ${
                    room.winner
                        ? `<p class="winner">🎉 Ganador: ${room.winner.name}</p>`
                        : ""
                }
            </div>
        `
            )
            .join("");
    }

    updateRoomSelect() {
        const select = document.getElementById("roomSelect");
        if (!select) return;

        select.innerHTML =
            `<option value="">Selecciona una sala</option>` +
            this.rooms
                .filter((r) => r.status === "active")
                .map((r) => `<option value="${r.id}">${r.name}</option>`)
                .join("");
    }

    closeRoom(room) {
        room.status = "closed";

        if (room.participants.length > 0) {
            const winner =
                room.participants[
                    Math.floor(Math.random() * room.participants.length)
                ];
            room.winner = winner;
            this.showWinnerModal(winner, room);
        }

        this.renderRooms();
        this.updateRoomSelect();
    }

    showWinnerModal(winner, room) {
        const modal = document.getElementById("winnerModal");
        const content = document.getElementById("winnerContent");

        if (modal && content) {
            content.innerHTML = `
                <h3>Ganador 🎉</h3>
                <p>Nombre: ${winner.name}</p>
                <p>Sala: ${room.name}</p>
                <p>Monto ganado: $${room.amount}</p>
            `;
            modal.classList.add("show");
        }
    }

    closeModal() {
        const modal = document.getElementById("winnerModal");
        if (modal) modal.classList.remove("show");
    }

    showNotification(message, type = "info") {
        let container = document.getElementById("notificationContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "notificationContainer";
            document.body.appendChild(container);
        }

        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    startTimers() {
        setInterval(() => {
            const now = new Date();
            this.rooms.forEach((room) => {
                if (room.status === "active" && now >= room.closingDate) {
                    this.closeRoom(room);
                }
            });
        }, 5000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.lotterySystem = new LotterySystem();
});








