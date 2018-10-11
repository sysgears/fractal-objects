package com.sysgears.fractalobjects {
  object Unfold {
    def multiply[T <: Product](p1: T, p2: T): T = {
      return p1;
    }

    def unfold[T <: Product](parts: List[T]): T = {
      return parts.reduce((p1, p2) => multiply(p1, p2))
    }
  }
}
