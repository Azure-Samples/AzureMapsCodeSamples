using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace SampleFunctions;

public class Optimizer
{
    private static readonly string[] AllowedDomains = [
        "https://samples.azuremaps.com/"
    ];

    [Function("Optimizer")]
    public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
    {
        // Check if the referer header is present and if the domain is allowed
        if (req.Headers.TryGetValue("Referer", out var referer) && AllowedDomains.Any(domain => referer.ToString().StartsWith(domain)))
        {
            // This is a sample/demo data response from the solver
            // You can replace this with your own data
            // The data should be in the same format as the response from the solver
            // More details: https://docs.nvidia.com/cuopt/user-guide/supported-features.html
            return new OkObjectResult("{\"reqId\":\"b3f34ef7-e037-402d-837e-2e97c48ebf74\",\"status\":\"fulfilled\",\"percentComplete\":100,\"response\":{\"response\":{\"solver_response\":{\"status\":0,\"num_vehicles\":4,\"solution_cost\":41830,\"vehicle_data\":{\"Car A\":{\"task_id\":[\"Depot\",\"Break\",\"0\",\"5\",\"Depot\"],\"arrival_stamp\":[28800,43200,43596,44172,44965],\"route\":[0,0,2,7,0],\"type\":[\"Depot\",\"Break\",\"Delivery\",\"Delivery\",\"Depot\"]},\"Car B\":{\"task_id\":[\"Depot\",\"Break\",\"6\",\"7\",\"Depot\"],\"arrival_stamp\":[28800,43200,43838,43987,44527],\"route\":[0,0,8,9,0],\"type\":[\"Depot\",\"Break\",\"Delivery\",\"Delivery\",\"Depot\"]},\"Car C\":{\"task_id\":[\"Depot\",\"3\",\"Break\",\"1\",\"Depot\"],\"arrival_stamp\":[28800,28954,43200,43540,43857],\"route\":[1,5,5,3,1],\"type\":[\"Depot\",\"Delivery\",\"Break\",\"Delivery\",\"Depot\"]},\"Car D\":{\"task_id\":[\"Depot\",\"Break\",\"4\",\"2\",\"Depot\"],\"arrival_stamp\":[28800,43200,43200,43480,43863],\"route\":[1,6,6,4,1],\"type\":[\"Depot\",\"Break\",\"Delivery\",\"Delivery\",\"Depot\"]}},\"dropped_tasks\":{\"task_id\":[],\"task_index\":[]},\"msg\":\"\"},\"perf_times\":null},\"warnings\":[],\"notes\":[]}}");
        }

        // Retrun access denied if the referer domain is not allowed
        return new StatusCodeResult(StatusCodes.Status403Forbidden);
    }
}
