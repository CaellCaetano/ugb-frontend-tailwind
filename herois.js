
const heroesList = document.getElementById("heroesList");

async function carregarHeroes() {
    try {
        const response = await fetch("/api/heroes");

        if (!response.ok) {
            throw new Error("Não foi possível carregar os heróis.");
        }

        const heroes = await response.json();

        heroesList.innerHTML = "";

        if (heroes.length === 0) {
            heroesList.textContent = "Nenhum herói cadastrado.";
            return;
        }

        heroes.forEach((hero) => {
            const card = document.createElement("div");

            card.className =
                "bg-slate-900 border border-slate-800 rounded-xl p-5";

            const nome = document.createElement("h3");
            nome.className = "text-xl font-bold";
            nome.textContent = hero.name;

            const universo = document.createElement("p");
            universo.className = "text-purple-400 mt-2";
            universo.textContent = "Universo: " + hero.universe;

            const poder = document.createElement("p");
            poder.className = "text-slate-400 mt-2";
            poder.textContent = "Poder: " + hero.power;

            card.append(nome, universo, poder);
            heroesList.appendChild(card);
        });

        } catch (error) {
            heroesList.textContent = error.message;
        }
    }


carregarHeroes();
