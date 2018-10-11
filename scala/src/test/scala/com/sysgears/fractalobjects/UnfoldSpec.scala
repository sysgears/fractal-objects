import org.scalatest._
import com.sysgears.fractalobjects.Unfold
import scala.reflect.runtime.universe._

case class Shape(listKey: List[Int] = List.empty[Int], mapKey: Map[String, String] = Map.empty[String, String])

class UnfoldSpec extends FlatSpec with Matchers {
  "An unfold" should "merge objects" in {
    val part1 = Shape(listKey = List(1), mapKey = Map("a" -> "a", "b" -> "b"))
    val part2 = Shape(listKey = List(2, 3), mapKey = Map("c" -> "c"))
    val result = Unfold.unfold(List(part1, part2))
    result shouldBe Shape(listKey = List(1, 2, 3), mapKey = Map("a" -> "a", "b" -> "b", "c" -> "c"))
  }
}