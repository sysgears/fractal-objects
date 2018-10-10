import org.scalatest._
import com.sysgears.fractalobjects.Unfold

case class Shape(listKey: List[Int] = List.empty[Int], mapKey: Map[String, String] = Map.empty[String, String])

class UnfoldSpec extends FlatSpec {
  "An unfold" should "merge objects" in {
    val part1 = Shape(listKey = List(1), mapKey = Map("a" -> "a", "b" -> "b"))
    val part2 = Shape(listKey = List(2, 3), mapKey = Map("c" -> "c"))
  }
}