document.addEventListener('DOMContentLoaded', () => {
  let grid = document.querySelector(".grid")
  let linie = document.querySelector('.linie')
  let punktacja = document.querySelector('.punkty')
  let oko = Array.from(grid.querySelectorAll('.grid div'))
  const startBtn = document.querySelector('.button')
  const koloryKlockow = ['red', 'green', 'blue', 'yellow', ' darkviolet', 'lime', 'orange']
  const wysokosc = 15
  const odstep = 10
  let Rotation = 0
  let nextRandom = 0
  let timerId
  let punkty = 0
  let linijka = 0

  //przypisanie funkcji do kodów klawiszy
  function control(e) {
    if (e.keyCode === 39)
      moveright()
    else if (e.keyCode === 38)
      rotate()
    else if (e.keyCode === 37)
      moveleft()
    else if (e.keyCode === 40)
      moveDown()
  }
  document.addEventListener('keydown', control)


  //ustaw pozycje  klocków na siatce
  const tetrisL = [

    [2, odstep, odstep + 1, odstep + 2, ],
    [1, odstep + 1, odstep * 2 + 1, odstep * 2 + 2],
    [odstep, odstep + 1, odstep + 2, odstep * 2],
    [1, 2, odstep + 2, odstep * 2 + 2]
  ]
  const tetrisL1 = [
    [odstep * 2 + 2, odstep, odstep + 1, odstep + 2, ],
    [1, odstep + 1, odstep * 2 + 1, odstep * 2],
    [0, odstep, odstep + 1, odstep + 2],
    [1, 2, odstep + 1, odstep * 2 + 1]
  ]
  const tetrisI = [
    [2, odstep + 2, odstep * 2 + 2, odstep * 3 + 2],
    [odstep, odstep + 1, odstep + 2, odstep + 3],
    [2, odstep + 2, odstep * 2 + 2, odstep * 3 + 2],
    [odstep, odstep + 1, odstep + 2, odstep + 3]
  ]
  const tetrisQ = [
    [1, 2, odstep + 1, odstep + 2],
    [1, 2, odstep + 1, odstep + 2],
    [1, 2, odstep + 1, odstep + 2],
    [1, 2, odstep + 1, odstep + 2]
  ]
  const tetrisT = [
    [2, odstep + 2, odstep * 2 + 2, odstep + 1],
    [odstep + 1, odstep * 2, odstep * 2 + 1, odstep * 2 + 2],
    [0, odstep, odstep * 2, odstep + 1],
    [0, 1, 2, odstep + 1]
  ]
  const tetrisZ = [
    [1, 2, odstep + 2, odstep + 3],
    [3, odstep + 2, odstep + 3, odstep * 2 + 2],
    [odstep + 1, odstep + 2, odstep * 2 + 2, odstep * 2 + 3],
    [2, odstep + 2, odstep + 1, odstep * 2 + 1]
  ]
  const tetrisZ1 = [
    [1, 2, odstep, odstep + 1],
    [1, odstep + 1, odstep + 2, odstep * 2 + 2],
    [odstep + 1, odstep + 2, odstep * 2, odstep * 2 + 1],
    [0, odstep, odstep + 1, odstep * 2 + 1]
  ]
  const tetrisy = [tetrisI, tetrisL, tetrisL1, tetrisQ, tetrisT, tetrisZ, tetrisZ1]

  let random = Math.floor(Math.random() * tetrisy.length)
  let rotacjaTetris = 0
  let losowanieTetris = tetrisy[random][rotacjaTetris]


  let kolumnaStartowa = 4 //ktora kolumna startowa
  //narysuj kształt
  function draw() {
    losowanieTetris.forEach(index => {

      oko[kolumnaStartowa + index].classList.add('oko')
      oko[kolumnaStartowa + index].style.background = koloryKlockow[random]

    })
  }

  //cofnij kształt i backround
  function undraw() {
    losowanieTetris.forEach(index => {
      oko[kolumnaStartowa + index].classList.remove('oko')
      oko[kolumnaStartowa + index].style.background = 'none'
    })
  }
  //przesuw w dól
  function moveDown() {
    undraw()
    kolumnaStartowa = kolumnaStartowa += odstep

    draw()
    freeze()

  }
  //start i  pauza gry
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 700)
      nextRandom = Math.floor(Math.random() * tetrisy.length)

    }
  })

  //przesuwanie  w prawo
  function moveright() {
    undraw()
    const Right = losowanieTetris.some(index => (kolumnaStartowa + index) % odstep === odstep - 1)
    if (!Right) kolumnaStartowa += 1
    if (losowanieTetris.some(index => oko[kolumnaStartowa + index].classList.contains('oko2'))) {
      kolumnaStartowa -= 1
    }
    draw()
  }
  //przesuwanie w lewo
  function moveleft() {
    undraw()
    const Left = losowanieTetris.some(index => (kolumnaStartowa + index) % odstep === 0)
    if (!Left) kolumnaStartowa -= 1
    if (losowanieTetris.some(index => oko[kolumnaStartowa + index].classList.contains('oko2'))) {
      kolumnaStartowa += 1
    }
    draw()
  }
  //obrót
  function rotate() {
    undraw()
    Rotation++
    if (Rotation === losowanieTetris.length) {
      Rotation = 0
    }
    losowanieTetris = tetrisy[random][Rotation]
    draw()
  }

  function freeze() {
    //warunek zatrzymania bloku
    if (losowanieTetris.some(index => oko[kolumnaStartowa + index + odstep].classList.contains('oko3') || oko[kolumnaStartowa + index + odstep].classList.contains('oko2'))) {
      //przypisanie mu class-y zatrzymującej  dla kolejnego  bloku
      losowanieTetris.forEach(index => oko[index + kolumnaStartowa].classList.add('oko2'))
      // rozpoczynanie  spadania nowego bloku
      random = nextRandom
      nextRandom = Math.floor(Math.random() * tetrisy.length)
      losowanieTetris = tetrisy[random][Rotation]
      kolumnaStartowa = 4
      draw()
      dodajPunkty()
      gameOver()
    }
  }

  //dodawanie punktow za utworzone linie
  function dodajPunkty() {

    for (i = 0; i < odstep*wysokosc; i += odstep) {
      const linia = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
      if (linia.every(index => oko[index].classList.contains('oko2'))) {
        punkty += 10
        linijka += 1
        punktacja.innerHTML = punkty
        linie.innerHTML = linijka
        linia.forEach(index => {

          oko[index].style.background = 'none'
          oko[index].classList.remove('oko2') || oko[index].classList.remove('oko')
        })

        const okoUsun = oko.splice(i, odstep)
        
        oko = okoUsun.concat(oko)
        oko.forEach(cell => grid.appendChild(cell))
      }
    }
  }
  function gameOver() {
    if (losowanieTetris.some(index =>oko[kolumnaStartowa + index].classList.contains('oko2'))) {
      punktacja.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
//kolumnaStartowa=currentPosition
//losowanieTetris=current
//oko=squares
//Koniec gry