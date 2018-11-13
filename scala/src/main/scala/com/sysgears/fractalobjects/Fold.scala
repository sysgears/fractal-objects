package com.sysgears.fractalobjects {
  import scala.reflect.runtime.universe._

  object Fold {
    private def classAccessors[T: TypeTag]: List[MethodSymbol] = typeOf[T].members.collect {
      case m: MethodSymbol if m.isCaseAccessor => m
    }.toList

    def multiply[T <: Product](p1: T, p2: T)(implicit tag: TypeTag[T]): T = {
      // val result: T = p1.clone();

      // classAccessors[T].foreach {

      // }
      return p1;
    }

    def fold[T <: Product](parts: List[T])(implicit tag: TypeTag[T]): T = {
      return parts.reduce((p1, p2) => multiply(p1, p2))
    }
  }
}
