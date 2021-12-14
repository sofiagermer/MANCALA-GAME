var numHoles = 12;
var numSeeds = 4;
var tabuleiro;
function getNumberHoles() {
    numHoles = document.getElementById("numHoles").value;
}

function getNumberSeeds(){
    numSeeds = document.getElementById("numSeeds").value;
}

function createBoard() {
    var tabuleiro = document.createElement("div");
    tabuleiro.setAttribute("id", "tabuleiro");
    document.getElementById("zonaTabuleiro").appendChild(tabuleiro);

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

        var seeds = document.createElement("div");
        seeds.setAttribute("class", "seedspace");
        e.appendChild(seeds);

        for (let j = 0; j < numSeeds; j++) {
            var s1 = document.createElement("div");
            s1.setAttribute("class", "seed");
            seeds.appendChild(s1);
        }
    }

    var f = document.createElement("div");
    f.setAttribute("class", "sub-sub-tabuleiro");
    f.setAttribute("id", "sub-sub-tabuleiro-2")
    document.getElementById("sub-tabuleiro").appendChild(f);

    for (let i = 0; i < numHoles/2; i++) {
        var g = document.createElement("div");
        g.setAttribute("class", "quadrado");
        document.getElementById("sub-sub-tabuleiro-2").appendChild(g);
        

        var seeds = document.createElement("div");
        seeds.setAttribute("class", "seedspace");
        g.appendChild(seeds);

        for (let j = 0; j < numSeeds; j++) {
            var s2 = document.createElement("div");
            s2.setAttribute("class", "seed");
            seeds.appendChild(s2);
        }
    }

    var h = document.createElement("div");
    h.setAttribute("class", "lateral");
    document.getElementById("tabuleiro").appendChild(h);
}

function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
  
    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";
  
    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
  }
  
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click(); 