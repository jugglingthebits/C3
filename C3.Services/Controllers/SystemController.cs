using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace C3.Services.Controllers
{
    [Route("api/[controller]")]
    public class SystemController: Controller
    {
        private readonly JsonSerializerSettings formatting;

        public SystemController()
        {
            formatting = new JsonSerializerSettings()
            {
                Formatting = Formatting.Indented,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
        }

        [HttpGet]
        public JsonResult Get()
        {
            //var result = _collection.Find(new BsonDocument()).ToList();

            var exampleSystems = new[]
            {
                new {Id = "123", Name = "system from server"}
            };
            return Json(exampleSystems, formatting);
        }

        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var exampleSystem = new {Id = "123", Name = "system from server" };
            return Json(exampleSystem, formatting);
        }
    }
}