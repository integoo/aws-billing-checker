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
    Granularity: 'MONTHLY', // Puede ser DAILY o MONTHLY
    Metrics: ['UnblendedCost'], // Se puede cambiar a 'BlendedCost' o 'UsageQuantity'
    GroupBy: [
        {
            Type: 'DIMENSION',
            Key: 'SERVICE' // Agrupar los resultados por servicio
        }
    ]
};

// Ejecuta la consulta para obtener el costo por servicio
async function getCost() {
    try {
        const command = new GetCostAndUsageCommand(params);
        const response = await client.send(command);

        // Itera sobre los resultados agrupados por servicio
        const resultsByTime = response.ResultsByTime[0];
        resultsByTime.Groups.forEach(group => {
            const service = group.Keys[0]; // El nombre del servicio
            const cost = group.Metrics.UnblendedCost.Amount; // Costo del servicio
            console.log(`Servicio: ${service}, Costo: $${cost}`);
        });
    } catch (error) {
        console.error("Error al consultar los costos:", error);
    }
}

// Llama a la función para obtener el costo por servicio
getCost();

