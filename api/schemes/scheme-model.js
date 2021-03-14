const { orderBy } = require("../../data/db-config");
const db = require("../../data/db-config");

function find() {
  return db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id", "asc")
    .select("sc.*")
    .count({ number_of_steps: "st.step_id" });
}

async function findById(scheme_id) {
  const data = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .where("sc.scheme_id", scheme_id)
    .select("sc.scheme_name", "st.*")
    .orderBy("st.step_number", "asc");

  const scId = data[0].scheme_id;
  const scName = data[0].scheme_name;

  const scheme = {
    scheme_id: scId ? scId : scheme_id,
    scheme_name: scName,
    steps: [],
  };

  if (data[0].step_id) {
    scheme.steps = data.map((scheme) => {
      return {
        step_id: scheme.step_id,
        step_number: scheme.step_number,
        instructions: scheme.instructions,
      };
    });
  } else {
    return scheme;
  }
}

function findSteps(scheme_id) {
  return db("steps as st")
    .leftJoin("schemes at sc", "sc.scheme_id", "st.scheme_id")
    .where("st.scheme_id", scheme_id)
    .select("st.step_id", "sc.scheme_name", "st.step_number", "st.instructions")
    .orderBy("st.step_number", "asc");
}

async function add(scheme) {
  const [id] = await db("schemes").insert({ scheme_name: scheme.scheme_name });
  return findById(id);
}

async function addStep(scheme_id, step) {
  await db("steps").insert({
    instructions: step.instructions,
    step_number: step.step_number,
    scheme_id: scheme_id,
  });
  return findById(scheme_id);
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
