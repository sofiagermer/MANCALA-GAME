//let numHoles = document.getElementById("numHoles");

class Pessoa {
    constructor(nome,ano,mês,dia) { /* ... */ }

    saudação(outro) {
        return 'Olá '+this.nome+', eu sou o '+outro.nome;
    }

    saudar(outro) {
        console.log(this.saudação(outro));
    }
}
// ...
document.writeln(joão.saudar(maria)); // Olá João, eu sou a Maria
