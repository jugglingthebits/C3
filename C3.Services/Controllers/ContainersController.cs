using Microsoft.AspNet.Mvc;
using MongoDB.Driver;
using C3.Services.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace C3.Services.Controllers
{
    [Route("api/[controller]")]
    public class ContainersController : Controller
    {
        private readonly JsonSerializerSettings formatting;
        private readonly ContainerNode[] exampleContainers;
        private readonly IMongoCollection<ContainerNode> collection;

        public ContainersController(IMongoDatabase database)
        {
            formatting = new JsonSerializerSettings()
            {
                Formatting = Formatting.Indented,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            collection = database.GetCollection<ContainerNode>("containers");

            exampleContainers = new[]
            {
                new ContainerNode(),
                new ContainerNode()
            };
        }

        // GET: api/values
        [HttpGet]
        public JsonResult Get()
        {
            //var result = _collection.Find(new BsonDocument()).ToList();

            return Json(exampleContainers, formatting);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            return Json(new ContainerNode() { X = 1, Y = 1, Name = "123" });
        }

        // POST api/values
        [HttpPost]
        public ActionResult Post([FromBody] ContainerNode value)
        {
            if (!ModelState.IsValid)
                return new HttpStatusCodeResult(400);

            collection.InsertOne(value);
            return new HttpStatusCodeResult(200);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] ContainerNode value)
        {
            return new HttpStatusCodeResult(200);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            return new HttpStatusCodeResult(200);
        }
    }
}
