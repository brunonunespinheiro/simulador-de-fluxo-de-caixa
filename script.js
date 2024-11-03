const transactions = [];
let balancePieChart;
let incomeExpensePieChart;

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
  updateBalancePieChart(currentBalance, totalDespesas);
  updateIncomeExpensePieChart(totalReceitas, totalDespesas);
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

// Função para atualizar o gráfico de pizza do Saldo Atual
function updateBalancePieChart(saldoDisponivel, despesasTotais) {
  const ctx = document.getElementById('balance-pie-chart').getContext('2d');
  
  if (balancePieChart) balancePieChart.destroy();

  balancePieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Saldo Disponível', 'Despesas Totais'],
      datasets: [{
        data: [saldoDisponivel, despesasTotais],
        backgroundColor: ['#4CAF50', '#FF5733'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: R$ ${value.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

// Função para atualizar o gráfico de pizza de Receitas vs Despesas
function updateIncomeExpensePieChart(totalReceitas, totalDespesas) {
  const ctx = document.getElementById('income-expense-pie-chart').getContext('2d');
  
  if (incomeExpensePieChart) incomeExpensePieChart.destroy();

  incomeExpensePieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Receitas Totais', 'Despesas Totais'],
      datasets: [{
        data: [totalReceitas, totalDespesas],
        backgroundColor: ['#4CAF50', '#FF5733'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: R$ ${value.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

// Função para gerar o PDF
document.getElementById('generate-pdf').addEventListener('click', async function() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Títulos e valores do dashboard
  pdf.setFontSize(16);
  pdf.text('Simulador de Fluxo de Caixa', 10, 10);
  pdf.setFontSize(12);
  pdf.text(`Saldo Atual: R$ ${document.getElementById('current-balance').textContent}`, 10, 20);
  pdf.text(`Total de Receitas: R$ ${document.getElementById('total-receitas').textContent}`, 10, 30);
  pdf.text(`Total de Despesas: R$ ${document.getElementById('total-despesas').textContent}`, 10, 40);

  // Gráfico de Saldo Atual
  const balanceCanvas = document.getElementById('balance-pie-chart');
  const balanceImgData = balanceCanvas.toDataURL('image/png');
  pdf.addImage(balanceImgData, 'PNG', 10, 50, 80, 80);

  // Gráfico de Receitas vs Despesas
  const incomeExpenseCanvas = document.getElementById('income-expense-pie-chart');
  const incomeExpenseImgData = incomeExpenseCanvas.toDataURL('image/png');
  pdf.addImage(incomeExpenseImgData, 'PNG', 110, 50, 80, 80);

  // Salvar PDF
  pdf.save('simulador_fluxo_caixa.pdf');
});
