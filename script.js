const heroForm = document.getElementById("heroForm");

heroForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const universe = document.getElementById("universe").value.trim();
    const power = document.getElementById("power").value.trim();

    if (!name || !universe || !power) {
        alert("Preencha todos os campos!");
        return;
    }

    const hero = {
        name,
        universe,
        power
    };

    try {
        const response = await fetch("/api/heroes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(hero)
        });

        if (!response.ok) {
            throw new Error("Não foi possível cadastrar o herói.");
        }

        alert("Herói cadastrado com sucesso!");

        heroForm.reset();
        await carregarHeroes();

    } catch (error) {
        alert(error.message);
        console.error("Erro ao cadastrar:", error);
    }
});

async function carregarHeroes() {
    const heroesList = document.getElementById("heroesList");
    const totalHeroes = document.getElementById("totalHeroes");
    const totalUniverses = document.getElementById("totalUniverses");

    try {
        const response = await fetch("/api/heroes");

        if (!response.ok) {
            throw new Error("Erro ao carregar os heróis.");
        }

        const heroes = await response.json();

        heroesList.innerHTML = "";

        totalHeroes.textContent = heroes.length;

        const universes = [...new Set(
            heroes.map(hero => hero.universe.trim().toLowerCase())
        )];

        totalUniverses.textContent = universes.length;

        if (heroes.length === 0) {
            heroesList.textContent = "Nenhum herói cadastrado.";
            return;
        }

        heroes.forEach((hero) => {
            const card = document.createElement("div");

            card.className =
                "bg-slate-800 border border-slate-800 rounded-2xl p-6 hover:border-purple-500 transition";

            const nome = document.createElement("h4");
            nome.className = "text-xl font-bold";
            nome.textContent = hero.name;

            const universo = document.createElement("p");
            universo.className = "text-purple-400 text-sm mt-2";
            universo.textContent = hero.universe;

            const poder = document.createElement("p");
            poder.className = "text-slate-400 text-sm mt-3";
            poder.textContent = hero.power;

            const editarButton = document.createElement("button");
            editarButton.textContent = "Editar herói";
            editarButton.className = "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mt-4 mr-2";
            editarButton.addEventListener("click", () => editarHero(hero));

            const poderButton = document.createElement("button");
            poderButton.textContent = "Alterar poder";
            poderButton.className = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-4 mr-2";
            poderButton.addEventListener("click", () => alterarPoder(hero));

            const excluirButton = document.createElement("button");
            excluirButton.textContent = "Excluir";
            excluirButton.className = "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-4";
            excluirButton.addEventListener("click", () => excluirHero(hero.id));

            card.append(nome, universo, poder, editarButton, poderButton, excluirButton);
            heroesList.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao listar heróis:", error);
        heroesList.textContent = "Não foi possível carregar os heróis.";
        heroesList.className = "text-black";
    }
}

async function editarHero(hero) {
    const name = prompt("Novo nome:", hero.name);
    if (name === null) return;

    const universe = prompt("Novo universo:", hero.universe);
    if (universe === null) return;

    const power = prompt("Novo poder:", hero.power);
    if (power === null) return;

    const dadosAtualizados = {
        name: name.trim(),
        universe: universe.trim(),
        power: power.trim()
    };

    if (!dadosAtualizados.name || !dadosAtualizados.universe || !dadosAtualizados.power) {
        alert("Todos os campos precisam ser preenchidos.");
        return;
    }

    try {
        const response = await fetch(`/api/heroes/${hero.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) {
            throw new Error("Não foi possível editar o herói.");
        }

        alert("Herói atualizado com sucesso!");
        carregarHeroes();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

async function alterarPoder(hero) {
    const power = prompt("Digite o novo poder:", hero.power);

    if (power === null) return;

    if (!power.trim()) {
        alert("O poder não pode ficar vazio.");
        return;
    }

    try {
        const response = await fetch(`/api/heroes/${hero.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ power: power.trim() })
        });

        if (!response.ok) {
            throw new Error("Não foi possível alterar o poder.");
        }

        alert("Poder atualizado com sucesso!");
        carregarHeroes();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

async function excluirHero(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este herói?");

    if (!confirmar) return;

    try {
        const response = await fetch(`/api/heroes/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Não foi possível excluir o herói.");
        }

        alert("Herói excluído com sucesso!");
        carregarHeroes();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

carregarHeroes();
