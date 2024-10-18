import { CostExplorerClient, GetCostAndUsageCommand } from "@aws-sdk/client-cost-explorer";

// Crea una instancia del cliente Cost Explorer
const client = new CostExplorerClient({ region: 'us-west-2' }); 

// Obtiene la fecha actual
const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

// Define los parámetros para el comando
const params = {
    TimePeriod: {
        Start: firstDayOfMonth, // Primer día del mes
        End: lastDayOfMonth // Último día del mes
    },
    Granularity: 'MONTHLY', // Puede ser DAILY, MONTHLY o HOURLY
    Metrics: ['UnblendedCost'] // Se puede cambiar a 'BlendedCost' o 'UsageQuantity'
};

// Ejecuta la consulta para obtener el costo
async function getCost() {
    try {
        const command = new GetCostAndUsageCommand(params);
        const response = await client.send(command);

        // Obtiene el costo total del mes
        const totalCost = response.ResultsByTime[0].Total.UnblendedCost.Amount;
        console.log(`El costo total para el mes es: $${totalCost}`);
    } catch (error) {
        console.error("Error al consultar los costos:", error);
    }
}

// Llama a la función para obtener el costo
getCost();

