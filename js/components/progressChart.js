import { Chart } from "@/components/ui/chart"
// Componente de gráfico de progresso

function createProgressChart(clientId, containerId) {
  // Criar o container para o gráfico
  const container = document.getElementById(containerId)
  if (!container) return null

  // Limpar o container
  container.innerHTML = ""

  // Criar o canvas para o gráfico
  const canvas = document.createElement("canvas")
  canvas.id = `progress-chart-${clientId}`
  container.appendChild(canvas)

  // Função para carregar os dados e criar o gráfico
  const loadChartData = async () => {
    try {
      // Obter dados de progresso do cliente
      const result = await window.getClientProgress(clientId) // Assuming getClientProgress is a global function
      if (!result.success) {
        container.innerHTML = '<p class="text-center text-gray-500">Erro ao carregar dados de progresso.</p>'
        return
      }

      const progressData = result.progress

      if (progressData.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500">Nenhum dado de progresso disponível.</p>'
        return
      }

      // Preparar dados para o gráfico
      const labels = progressData.map((item) => `Sessão ${item.sessionNumber}`)
      const data = progressData.map((item) => item.progressValue)

      // Criar o gráfico usando Chart.js
      const ctx = canvas.getContext("2d")
      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Progresso",
              data: data,
              backgroundColor: "rgba(79, 70, 229, 0.2)",
              borderColor: "rgba(79, 70, 229, 1)",
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: "rgba(79, 70, 229, 1)",
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const index = context.dataIndex
                  const notes = progressData[index]?.notes
                  let label = `Progresso: ${context.raw}/5`
                  if (notes) {
                    label += `\nNotas: ${notes}`
                  }
                  return label
                },
              },
            },
          },
        },
      })
    } catch (error) {
      console.error("Erro ao criar gráfico de progresso:", error)
      container.innerHTML = '<p class="text-center text-gray-500">Erro ao carregar dados de progresso.</p>'
    }
  }

  // Carregar dados e criar o gráfico
  loadChartData()

  return {
    refresh: loadChartData,
  }
}
