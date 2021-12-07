var numHoles = 12;
function getNumberHoles() {
    numHoles = document.getElementById("numHoles").value;
    document.getElementById("demo").innerHTML = x;
  }

function createBoard() {
    var a = document.createElement("div");
    a.setAttribute("id", "tabuleiro");
    document.body.appendChild(a);

    var b = document.createElement("div");
    b.setAttribute("class", "lateral");
    document.getElementById("tabuleiro").appendChild(b);

    var c = document.createElement("div");
    c.setAttribute("id", "sub-tabuleiro");
    document.getElementById("tabuleiro").appendChild(c);

    var d = document.createElement("div");
    d.setAttribute("class", "sub-sub-tabuleiro");
    d.setAttribute("id", "sub-sub-tabuleiro-1")
    document.getElementById("sub-tabuleiro").appendChild(d);

    for (let i = 0; i < numHoles/2; i++) {
        var e = document.createElement("div");
        e.setAttribute("class", "quadrado");
        document.getElementById("sub-sub-tabuleiro-1").appendChild(e);
    }

    var f = document.createElement("div");
    f.setAttribute("class", "sub-sub-tabuleiro");
    f.setAttribute("id", "sub-sub-tabuleiro-2")
    document.getElementById("sub-tabuleiro").appendChild(f);

    for (let i = 0; i < numHoles/2; i++) {
        var g = document.createElement("div");
        g.setAttribute("class", "quadrado");
        document.getElementById("sub-sub-tabuleiro-2").appendChild(g);
    }

    var h = document.createElement("div");
    h.setAttribute("class", "lateral");
    document.getElementById("tabuleiro").appendChild(h);
}
