let formulasVisible = false
let terminalId = 0
let allResultsVisible = false

function toggleFormulas() {
  const formulas = document.querySelectorAll('.formula')
  const button = document.getElementById('formulaToggleBtn')
  formulasVisible = !formulasVisible
  formulas.forEach((f) => (f.style.display = formulasVisible ? 'inline' : 'none'))
  button.textContent = formulasVisible ? 'Скрыть формулы' : 'Показать формулы'
}

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function parseNumber(s) {
  return parseFloat(s.replace(/\s/g, '')) || 0
}

function toggleValue(id) {
  const valueEl = document.getElementById(id)
  const toggleEl = valueEl.nextElementSibling
  if (valueEl.style.display !== 'inline') {
    valueEl.style.display = 'inline'
    toggleEl.style.display = 'none'
  }
}

function addTerminal(value = '') {
  terminalId++
  const container = document.getElementById('terminalsContainer')

  const terminalDiv = document.createElement('div')
  terminalDiv.className = 'terminal'
  terminalDiv.setAttribute('data-id', terminalId)

  const label = document.createElement('label')
  label.textContent = `Терминал ${terminalId}`

  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = 'Доход с терминала (₽)'
  input.value = formatNumber(value || '')
  input.oninput = () => {
    input.value = formatNumber(parseNumber(input.value))
    calculateAverage()
  }

  terminalDiv.appendChild(label)
  terminalDiv.appendChild(input)

  if (container.children.length >= 1) {
    const removeBtn = document.createElement('button')
    removeBtn.textContent = 'Удалить'
    removeBtn.className = 'button'
    removeBtn.style.backgroundColor = '#9e9e9e'
    removeBtn.onclick = () => {
      terminalDiv.remove()
      calculateAverage()
    }
    terminalDiv.appendChild(removeBtn)
  }

  container.appendChild(terminalDiv)
  calculateAverage()
}

function calculateAverage() {
  const container = document.getElementById('terminalsContainer')
  const inputs = container.querySelectorAll('input')

  let total = 0
  inputs.forEach((input) => {
    total += parseNumber(input.value)
  })

  const count = inputs.length
  const average = count > 0 ? total / count : 0

  const turnover = parseNumber(document.getElementById('turnover').value)
  const penalty = parseNumber(document.getElementById('penalty').value)

  document.getElementById('totalIncome').textContent = formatNumber(Math.round(total))
  document.getElementById('terminalCount').textContent = count
  document.getElementById('averageIncome').textContent = formatNumber(Math.round(average))
  document.getElementById('fineAmount').textContent = formatNumber(
    average < turnover ? Math.round(penalty * count) : 0
  )
}

function toggleAllResults() {
  const values = document.querySelectorAll('.results .value')
  const toggles = document.querySelectorAll('.results .show-toggle')
  const button = document.getElementById('allResultsToggleBtn')

  allResultsVisible = !allResultsVisible

  values.forEach((val) => (val.style.display = allResultsVisible ? 'inline' : 'none'))
  toggles.forEach((t) => (t.style.display = allResultsVisible ? 'none' : 'inline-block'))

  button.textContent = allResultsVisible ? 'Скрыть все значения' : 'Показать все значения'
}

document.getElementById('turnover').addEventListener('input', (e) => {
  const val = parseNumber(e.target.value)
  e.target.value = formatNumber(val)
  calculateAverage()
})

document.getElementById('penalty').addEventListener('input', (e) => {
  const val = parseNumber(e.target.value)
  e.target.value = formatNumber(val)
  calculateAverage()
})

window.onload = () => {
  addTerminal(0)
}
