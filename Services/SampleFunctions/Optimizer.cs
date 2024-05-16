using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace SampleFunctions;

public class Optimizer
{
    private static readonly string[] AllowedDomains = [
        "https://samples.azuremaps.com/",
        "http://localhost:58745/" // For local testing
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
            return new OkObjectResult("{\"reqId\":\"3b24d203-1275-4284-8620-b3679f059e4a\",\"status\":\"fulfilled\",\"percentComplete\":100,\"response\":{\"response\":{\"solver_response\":{\"status\":0,\"num_vehicles\":4,\"solution_cost\":93236,\"vehicle_data\":{\"Car A\":{\"task_id\":[\"Depot\",\"Break\",\"0\",\"15\",\"1\",\"22\",\"12\",\"Depot\"],\"arrival_stamp\":[28800,43200,43548,43990,44269,44333,44493,44698],\"route\":[0,0,2,17,3,24,14,0],\"type\":[\"Depot\",\"Break\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Depot\"]},\"Car B\":{\"task_id\":[\"Depot\",\"Break\",\"20\",\"14\",\"7\",\"6\",\"10\",\"11\",\"23\",\"Depot\"],\"arrival_stamp\":[28800,43200,43567,44253,44800,44911,45195,45563,45938,46350],\"route\":[0,0,22,16,9,8,12,13,25,0],\"type\":[\"Depot\",\"Break\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Depot\"]},\"Car C\":{\"task_id\":[\"Depot\",\"Break\",\"9\",\"18\",\"19\",\"16\",\"13\",\"17\",\"8\",\"5\",\"21\",\"Depot\"],\"arrival_stamp\":[28800,43200,43526,43649,44107,44449,44608,45160,45561,45970,46609,46902],\"route\":[1,1,11,20,21,18,15,19,10,7,23,1],\"type\":[\"Depot\",\"Break\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Delivery\",\"Depot\"]},\"Car D\":{\"task_id\":[\"Depot\",\"Break\",\"3\",\"4\",\"2\",\"Depot\"],\"arrival_stamp\":[28800,43200,43328,43609,43859,44192],\"route\":[1,1,5,6,4,1],\"type\":[\"Depot\",\"Break\",\"Delivery\",\"Delivery\",\"Delivery\",\"Depot\"]}},\"dropped_tasks\":{\"task_id\":[],\"task_index\":[]},\"msg\":\"\"},\"perf_times\":null},\"warnings\":[],\"notes\":[]}}");
        }

        // Retrun access denied if the referer domain is not allowed
        return new StatusCodeResult(StatusCodes.Status403Forbidden);
    }
}
