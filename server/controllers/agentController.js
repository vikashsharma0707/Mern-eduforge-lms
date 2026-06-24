// // // const agents = require('../agents');

// // // exports.studyPlanner = async (req, res) =>
// // //   res.json(await agents.studyPlanner(req.user._id, req.body.goal));
// // // exports.career = async (req, res) =>
// // //   res.json(await agents.career(req.user._id, req.body.profile));
// // // exports.interview = async (req, res) =>
// // //   res.json(await agents.interview(req.user._id, req.body.topic));
// // // exports.codingMentor = async (req, res) =>
// // //   res.json(await agents.codingMentor(req.user._id, req.body.code));
// // // exports.recommender = async (req, res) =>
// // //   res.json(await agents.recommender(req.user._id, req.body.interests));
// // // exports.revision = async (req, res) =>
// // //   res.json(await agents.revision(req.user._id, req.body.topic));


// // const agents = require('../agents');   // ← yahan path sahi hona chahiye

// // exports.studyPlanner = async (req, res) => {
// //   try {
// //     const result = await agents.studyPlanner(req.user._id, req.body.goal);
// //     res.json(result);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Failed to generate study plan' });
// //   }
// // };

// // exports.career = async (req, res) => {
// //   try {
// //     const result = await agents.career(req.user._id, req.body.profile);
// //     res.json(result);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Failed to generate career advice' });
// //   }
// // };

// // exports.interview = async (req, res) => {
// //   try {
// //     const result = await agents.interview(req.user._id, req.body.topic);
// //     res.json(result);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Failed to generate interview questions' });
// //   }
// // };

// // exports.codingMentor = async (req, res) => {
// //   try {
// //     const result = await agents.codingMentor(req.user._id, req.body.code);
// //     res.json(result);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Failed to review code' });
// //   }
// // };

// // exports.recommender = async (req, res) => {
// //   try {
// //     const result = await agents.recommender(req.user._id, req.body.interests);
// //     res.json(result);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Failed to get recommendations' });
// //   }
// // };

// // exports.revision = async (req, res) => {
// //   try {
// //     const result = await agents.revision(req.user._id, req.body.topic);
// //     res.json(result);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Failed to generate revision material' });
// //   }
// // };





// const agents = require('../agents');

// exports.studyPlanner = async (req, res) => {
//   try {
//     const result = await agents.studyPlanner(req.user._id, req.body.goal);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to generate study plan' });
//   }
// };

// exports.career = async (req, res) => {
//   try {
//     const result = await agents.career(req.user._id, req.body.profile);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to generate career advice' });
//   }
// };

// exports.interview = async (req, res) => {
//   try {
//     const result = await agents.interview(req.user._id, req.body.topic);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to generate interview questions' });
//   }
// };

// exports.codingMentor = async (req, res) => {
//   try {
//     const result = await agents.codingMentor(req.user._id, req.body.code);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to review code' });
//   }
// };

// exports.recommender = async (req, res) => {
//   try {
//     const result = await agents.recommender(req.user._id, req.body.interests);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to get recommendations' });
//   }
// };

// exports.revision = async (req, res) => {
//   try {
//     const result = await agents.revision(req.user._id, req.body.topic);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to generate revision material' });
//   }
// };




const agents = require('../agents');
const AgentRun = require('../models/AgentRun');

const TITLE_MAX = 60;
const titleFrom = (text) => String(text || '').trim().slice(0, TITLE_MAX) || 'Untitled';

// Wraps an agent call: runs it, saves the outcome (success or failure) as an
// AgentRun, and responds. This is what makes every question a student asks
// show up in their history, even ones that error out.
async function runAndSave({ req, res, agentType, input, callAgent }) {
  let result;
  let status = 'ok';
  try {
    result = await callAgent();
  } catch (error) {
    console.error(`[agent:${agentType}]`, error);
    status = 'failed';
    result = { answer: '', transcript: [] };
  }

  let run;
  try {
    run = await AgentRun.create({
      user: req.user._id,
      agentType,
      title: titleFrom(input),
      input: String(input || ''),
      answer: result.answer || '',
      transcript: result.transcript || [],
      status,
    });
  } catch (saveErr) {
    // Don't let a DB hiccup hide the agent's actual answer from the student.
    console.error(`[agent:${agentType}] failed to save history`, saveErr);
  }

  if (status === 'failed') {
    return res.status(500).json({ message: 'Agent run failed', runId: run?._id });
  }

  res.json({ ...result, runId: run?._id });
}

exports.studyPlanner = (req, res) =>
  runAndSave({
    req,
    res,
    agentType: 'studyPlanner',
    input: req.body.goal,
    callAgent: () => agents.studyPlanner(req.user._id, req.body.goal),
  });

exports.career = (req, res) =>
  runAndSave({
    req,
    res,
    agentType: 'career',
    input: req.body.profile,
    callAgent: () => agents.career(req.user._id, req.body.profile),
  });

exports.interview = (req, res) =>
  runAndSave({
    req,
    res,
    agentType: 'interview',
    input: req.body.topic,
    callAgent: () => agents.interview(req.user._id, req.body.topic),
  });

exports.codingMentor = (req, res) =>
  runAndSave({
    req,
    res,
    agentType: 'codingMentor',
    input: req.body.code,
    callAgent: () => agents.codingMentor(req.user._id, req.body.code),
  });

exports.recommender = (req, res) =>
  runAndSave({
    req,
    res,
    agentType: 'recommender',
    input: req.body.interests,
    callAgent: () => agents.recommender(req.user._id, req.body.interests),
  });

exports.revision = (req, res) =>
  runAndSave({
    req,
    res,
    agentType: 'revision',
    input: req.body.topic,
    callAgent: () => agents.revision(req.user._id, req.body.topic),
  });

// ==================== HISTORY ====================

exports.listRuns = async (req, res) => {
  try {
    const { agentType } = req.query;
    const filter = { user: req.user._id };
    if (agentType) filter.agentType = agentType;

    const runs = await AgentRun.find(filter)
      .sort({ createdAt: -1 })
      .select('agentType title status createdAt');
    res.json(runs);
  } catch (error) {
    console.error('[agent:listRuns]', error);
    res.status(500).json({ message: 'Failed to load agent history' });
  }
};

exports.getRun = async (req, res) => {
  try {
    const run = await AgentRun.findOne({ _id: req.params.id, user: req.user._id });
    if (!run) return res.status(404).json({ message: 'Run not found' });
    res.json(run);
  } catch (error) {
    console.error('[agent:getRun]', error);
    res.status(500).json({ message: 'Failed to load run' });
  }
};

exports.deleteRun = async (req, res) => {
  try {
    await AgentRun.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ ok: true });
  } catch (error) {
    console.error('[agent:deleteRun]', error);
    res.status(500).json({ message: 'Failed to delete run' });
  }
};