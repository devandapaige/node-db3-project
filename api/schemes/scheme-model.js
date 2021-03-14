const { orderBy } = require("../../data/db-config");
const db = require("../../data/db-config");

function find() {
  return db("*")
    .from("schemes")
    .leftJoin("steps", "schemes.scheme+id", "steps.scheme_id")
    .groupBy("schemes.scheme_id")
    .orderBy("schemes.scheme_id");
}

async function findById(scheme_id) {
  return db("steps.*")
    .from("schemes")
    .leftJoin("steps", "scheme.scheme_id", "steps.scheme_id")
    .where(("schemes.scheme_id" = scheme_id));
  orderBy("steps.step_number");
}

function findSteps(scheme_id) {}

function add(scheme) {}

function addStep(scheme_id, step) {}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
