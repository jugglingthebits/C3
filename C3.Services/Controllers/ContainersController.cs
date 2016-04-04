using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Http;
using MongoDB.Driver;
using C3.Services.Model;

namespace C3.Services.Controllers
{
    [Route("api/[controller]")]
    public class ContainersController : Controller
    {
        private ContainerNode[] _exampleContainers;
        private IMongoCollection<ContainerNode> _collection;

        public ContainersController(IMongoDatabase database)
        {
            _collection = database.GetCollection<ContainerNode>("containers");

            _exampleContainers = new[]
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

            var formatting = new Newtonsoft.Json.JsonSerializerSettings() {
                Formatting = Newtonsoft.Json.Formatting.Indented
            };
            return Json(_exampleContainers, formatting);
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

            _collection.InsertOne(value);
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
