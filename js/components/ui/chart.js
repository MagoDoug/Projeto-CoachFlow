// Componentes de gráfico para o CoachFlow
// Este arquivo exporta todos os componentes necessários para os gráficos

// Exportar Chart do Chart.js global (carregado via CDN)
export const Chart = window.Chart

// Componente de container para gráficos
export const ChartContainer = (props) => {
  const { children, className, config } = props

  // Aplicar configuração de cores aos elementos CSS
  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      if (value.color) {
        document.documentElement.style.setProperty(`--color-${key}`, value.color)
      }
    })
  }

  // Retornar um div container
  const container = document.createElement("div")
  container.className = className || ""

  // Adicionar os filhos ao container
  if (typeof children === "function") {
    container.appendChild(children())
  } else if (children instanceof HTMLElement) {
    container.appendChild(children)
  }

  return container
}

// Componente de tooltip para gráficos
export const ChartTooltip = (props) => {
  const { content } = props

  // Criar um tooltip personalizado
  const tooltip = document.createElement("div")
  tooltip.className = "chart-tooltip bg-white p-2 rounded shadow-lg border border-gray-200"
  tooltip.style.position = "absolute"
  tooltip.style.display = "none"
  tooltip.style.zIndex = "10"

  // Adicionar conteúdo ao tooltip
  if (content) {
    if (typeof content === "function") {
      tooltip.appendChild(content())
    } else if (content instanceof HTMLElement) {
      tooltip.appendChild(content)
    } else {
      tooltip.textContent = String(content)
    }
  }

  return tooltip
}

// Componente de conteúdo do tooltip
export const ChartTooltipContent = (props) => {
  // Criar o conteúdo do tooltip
  return (context) => {
    if (!context.tooltip || !context.tooltip.dataPoints || context.tooltip.dataPoints.length === 0) {
      return null
    }

    const dataPoint = context.tooltip.dataPoints[0]
    const content = document.createElement("div")

    // Título
    const title = document.createElement("div")
    title.className = "font-medium"
    title.textContent = dataPoint.label || ""
    content.appendChild(title)

    // Valor
    const value = document.createElement("div")
    value.className = "text-sm"
    value.textContent = `${dataPoint.dataset.label || "Valor"}: ${dataPoint.raw}`
    content.appendChild(value)

    return content
  }
}

// Componente de legenda para gráficos
export const ChartLegend = (props) => {
  const { content } = props

  // Criar uma legenda personalizada
  const legend = document.createElement("div")
  legend.className = "chart-legend flex flex-wrap gap-4 mt-4"

  // Adicionar conteúdo à legenda
  if (content) {
    if (typeof content === "function") {
      legend.appendChild(content())
    } else if (content instanceof HTMLElement) {
      legend.appendChild(content)
    }
  }

  return legend
}

// Componente de conteúdo da legenda
export const ChartLegendContent = (props) => {
  // Criar o conteúdo da legenda
  return (chart) => {
    const content = document.createElement("div")
    content.className = "flex flex-wrap gap-4"

    if (!chart || !chart.data || !chart.data.datasets) {
      return content
    }

    chart.data.datasets.forEach((dataset, i) => {
      const item = document.createElement("div")
      item.className = "flex items-center"

      // Cor
      const color = document.createElement("div")
      color.className = "w-3 h-3 rounded-full mr-2"
      color.style.backgroundColor = dataset.borderColor || dataset.backgroundColor
      item.appendChild(color)

      // Label
      const label = document.createElement("span")
      label.className = "text-sm text-gray-700"
      label.textContent = dataset.label || `Dataset ${i + 1}`
      item.appendChild(label)

      content.appendChild(item)
    })

    return content
  }
}

// Componente de estilo para gráficos
export const ChartStyle = (props) => {
  const { colors } = props

  // Criar um elemento de estilo
  const style = document.createElement("style")

  // Definir cores personalizadas
  let css = ""
  if (colors) {
    Object.entries(colors).forEach(([key, value]) => {
      css += `--chart-${key}: ${value};\n`
    })
  }

  // Adicionar estilos padrão
  css += `
    .chart-tooltip {
      background-color: white;
      border-radius: 0.25rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
    }
  `

  style.textContent = `:root {\n${css}\n}`

  return style
}
