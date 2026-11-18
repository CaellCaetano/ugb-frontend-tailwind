const heroesList = document.getElementById("heroesList");
const totalHeroes = document.getElementById("totalHeroes");
const searchHero = document.getElementById("searchHero");

let heroes = [];

async function carregarHeroes() {
    try {
        const response = await fetch("/api/heroes");

        if (!response.ok) {
            throw new Error("Não foi possível carregar os heróis.");
        }

        heroes = await response.json();

        atualizarCatalogo();

    } catch (error) {
        console.error("Erro ao carregar heróis:", error);
        heroesList.textContent = "Erro ao carregar o catálogo.";
    }
}

function atualizarCatalogo() {
    const pesquisa = searchHero.value.toLowerCase().trim();

    const heroesFiltrados = heroes.filter((hero) => {
        return (
            hero.name.toLowerCase().includes(pesquisa) ||
            hero.universe.toLowerCase().includes(pesquisa) ||
            hero.power.toLowerCase().includes(pesquisa)
        );
    });

    heroesList.innerHTML = "";

    totalHeroes.textContent = heroesFiltrados.length;

    if (heroesFiltrados.length === 0) {
        heroesList.textContent = "Nenhum herói encontrado.";
        return;
    }

    heroesFiltrados.forEach((hero) => {
        const card = document.createElement("div");

        card.className =
            "bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500 transition";

        const nome = document.createElement("h3");
        nome.className = "text-xl font-bold text-white";
        nome.textContent = hero.name;

        const universo = document.createElement("p");
        universo.className = "text-purple-400 mt-3";
        universo.textContent = "Universo: " + hero.universe;

        const poder = document.createElement("p");
        poder.className = "text-slate-400 mt-2";
        poder.textContent = "Poder: " + hero.power;

        const editarButton = document.createElement("button");
        editarButton.textContent = "Editar";
        editarButton.className =
            "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mt-4 mr-2";

        editarButton.addEventListener("click", () => editarHero(hero));

        const poderButton = document.createElement("button");
        poderButton.textContent = "Alterar poder";
        poderButton.className =
            "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-4 mr-2";

        poderButton.addEventListener("click", () => alterarPoder(hero));

        const excluirButton = document.createElement("button");
        excluirButton.textContent = "Excluir";
        excluirButton.className =
            "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-4";

        excluirButton.addEventListener("click", () => excluirHero(hero.id));

        card.append(
            nome,
            universo,
            poder,
            editarButton,
            poderButton,
            excluirButton
        );

        heroesList.appendChild(card);
            });
        }

        searchHero.addEventListener("input", atualizarCatalogo);

carregarHeroes();

async function editarHero(hero) {
    const name = prompt("Novo nome:", hero.name);
    if (name === null) return;

    const universe = prompt("Novo universo:", hero.universe);
    if (universe === null) return;

    const power = prompt("Novo poder:", hero.power);
    if (power === null) return;

    const dados = {
        name: name.trim(),
        universe: universe.trim(),
        power: power.trim()
    };

    if (!dados.name || !dados.universe || !dados.power) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch(`/api/heroes/${hero.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error("Erro ao editar herói.");
        }

        alert("Herói atualizado!");
        await carregarHeroes();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

async function alterarPoder(hero) {
    const power = prompt("Novo poder:", hero.power);

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
            body: JSON.stringify({
                power: power.trim()
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao alterar poder.");
        }

        alert("Poder atualizado!");
        await carregarHeroes();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

async function excluirHero(id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir este herói?"
    );

    if (!confirmar) return;

    try {
        const response = await fetch(`/api/heroes/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir herói.");
        }

        alert("Herói excluído!");
        await carregarHeroes();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

