-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Projects
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Projects
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Projects` DEFAULT CHARACTER SET utf8 ;
USE `Projects` ;

-- -----------------------------------------------------
-- Table `Projects`.`Brukere`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Projects`.`Brukere` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `EPost` VARCHAR(40) NOT NULL,
  `BrukerNavn` VARCHAR(40) NOT NULL,
  `Navn` VARCHAR(80) NOT NULL,
  `Telefon` VARCHAR(8) NOT NULL,
  UNIQUE INDEX `BrukerNavn_UNIQUE` (`BrukerNavn` ASC) VISIBLE,
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Projects`.`ProsjektType`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Projects`.`ProsjektType` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Navn` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Projects`.`Prosjekter`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Projects`.`Prosjekter` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Navn` VARCHAR(40) NOT NULL,
  `ProsjektType` INT NOT NULL,
  `Beskrivelse` VARCHAR(2048) NOT NULL,
  `Owner` INT NOT NULL,
  INDEX `fk_Prosjekter_Brukere1_idx` (`Owner` ASC) VISIBLE,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  INDEX `fk_Prosjekter_Prosjekt Type1_idx` (`ProsjektType` ASC) VISIBLE,
  CONSTRAINT `fk_Prosjekter_Brukere1`
    FOREIGN KEY (`Owner`)
    REFERENCES `Projects`.`Brukere` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Prosjekter_Prosjekt Type1`
    FOREIGN KEY (`ProsjektType`)
    REFERENCES `Projects`.`ProsjektType` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
