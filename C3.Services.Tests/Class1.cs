using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;

namespace C3.Services.Tests
{
    public class Class1
    {
        [Fact]
        public void PassingTest()
        {
            Assert.Equal(4, Add(2, 2));
        }

        [Fact]
        public void FailingTest()
        {
            Assert.Equal(5, Add(2, 2));
        }

        int Add(int x, int y)
        {
            return x + y;
        }

        public interface IFoo
        {
            bool DoSomething(string s);
            bool TryParse(string s, out string o);
        }


        [Fact]
        public void MoqTest()
        {
            var mock = new Mock<IFoo>();
            mock.Setup(foo => foo.DoSomething("ping")).Returns(true);

            var value = mock.Object.DoSomething("ping");
            Assert.Equal(true, value);
        }
    }
}
