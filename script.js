const transactions = [];
let pieChart;

// Função para adicionar transação manual e atualizar o dashboard
document.getElementById('transaction-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const transaction = {
    type: document.getElementById('type').value,
    name: document.getElementById('name').value,
    value: parseFloat(document.getElementById('value').value),
    date: document.getElementById('date').value
  };

  transactions.push(transaction);
  updateDashboard();
  clearForm();
});

// Função para limpar o formulário após adicionar transação
function clearForm() {
  document.getElementById('type').value = 'Receita';
  document.getElementById('name').value = '';
  document.getElementById('value').value = '';
  document.getElementById('date').value = '';
}

// Função para atualizar o dashboard com valores e gráficos
function updateDashboard() {
  const totalReceitas = transactions.filter(t => t.type.toLowerCase() === 'receita').reduce((acc, t) => acc + t.value, 0);
  const totalDespesas = transactions.filter(t => t.type.toLowerCase() === 'despesa').reduce((acc, t) => acc + t.value, 0);
  const currentBalance = totalReceitas - totalDespesas;

  document.getElementById('current-balance').textContent = currentBalance.toFixed(2);
  document.getElementById('total-receitas').textContent = totalReceitas.toFixed(2);
  document.getElementById('total-despesas').textContent = totalDespesas.toFixed(2);

  updateTransactionList();
  updatePieChart(totalReceitas, totalDespesas, currentBalance);
}

// Função para exibir a lista de transações no dashboard
function updateTransactionList() {
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = transactions.map(t => `
    <tr>
      <td>${t.type}</td>
      <td>${t.name}</td>
      <td>R$ ${t.value.toFixed(2)}</td>
      <td>${new Date(t.date).toLocaleDateString('pt-BR')}</td>
    </tr>
  `).join('');
}

// Função para atualizar o gráfico de pizza
function updatePieChart(totalReceitas, totalDespesas, currentBalance) {
  const ctx = document.getElementById('pie-chart').getContext('2d');
  
  // Se o gráfico já existe, destrua-o antes de recriar para evitar sobreposição
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Receitas', 'Despesas', 'Saldo Atual'],
      datasets: [{
        data: [totalReceitas, totalDespesas, currentBalance],
        backgroundColor: ['#4CAF50', '#FF5733', '#FFD700'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      }
    }
  });
}
