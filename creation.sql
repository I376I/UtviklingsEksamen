-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Brukere`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Brukere` (
  `BrukerNavn` VARCHAR(40) NOT NULL,
  `Navn` VARCHAR(80) NOT NULL,
  `E-Post` VARCHAR(40) NOT NULL,
  `Telefon` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`BrukerNavn`),
  UNIQUE INDEX `BrukerNavn_UNIQUE` (`BrukerNavn` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Prosjekter`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Prosjekter` (
  `Tilhører` VARCHAR(40) NOT NULL,
  `Navn` VARCHAR(40) NOT NULL,
  `ProsjektType` INT NOT NULL,
  `Beskrivelse` VARCHAR(2048) NOT NULL,
  PRIMARY KEY (`Tilhører`),
  UNIQUE INDEX `ProsjektID_UNIQUE` (`Tilhører` ASC) VISIBLE,
  CONSTRAINT `fk_Prosjekter_Brukere`
    FOREIGN KEY (`Tilhører`)
    REFERENCES `mydb`.`Brukere` (`BrukerNavn`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Prosjekt Type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Prosjekt Type` (
  `ID` INT NOT NULL,
  `Navn` VARCHAR(60) NULL,
  PRIMARY KEY (`ID`),
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC) VISIBLE,
  CONSTRAINT `fk_Prosjekt Type_Prosjekter1`
    FOREIGN KEY (`ID`)
    REFERENCES `mydb`.`Prosjekter` (`ProsjektType`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
