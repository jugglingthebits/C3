using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace C3.Services.Model
{
    public class ContainerNode
    {
        public ObjectId Id { get; set; }

        [Required]
        public int X { get; set; }

        [Required]
        public int Y { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsExternalSystem { get; set; }

        public List<ContainerEdge> OutgoingEdges { get; set; }
    }

    public class ContainerEdge
    {
        public ObjectId TargetNodeId { get; set; }

        public string Description { get; set; }
        public string Protocol { get; set; }
    }
}
