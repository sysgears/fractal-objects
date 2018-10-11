import org.ensime.EnsimeKeys._

ensimeIgnoreMissingDirectories := true

scalaVersion := "2.12.7"

name := "fractalobjects"
organization := "com.sysgears"
version := "0.9.0"

libraryDependencies += "org.scalatest" %% "scalatest" % "3.0.5" % Test
libraryDependencies += "org.scalactic" %% "scalactic" % "3.0.5"

resolvers += "Artima Maven Repository" at "http://repo.artima.com/releases"
