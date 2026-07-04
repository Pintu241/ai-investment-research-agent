import {
  StateGraph,
  START,
  END
} from "@langchain/langgraph";

import {
  InvestmentState
} from "./state.js";

import {
  researchNode
} from "../nodes/researchNode.js";

import {
  financialNode
} from "../nodes/financialNode.js";

import {
  newsNode
} from "../nodes/newsNode.js";

import {
  riskNode
} from "../nodes/riskNode.js";

import {
  decisionNode
} from "../nodes/decisionNode.js";

const workflow = new StateGraph(
  InvestmentState
);

workflow.addNode(
  "researchNode",
  researchNode
);

workflow.addNode(
  "financialNode",
  financialNode
);

workflow.addNode(
  "newsNode",
  newsNode
);

workflow.addNode(
  "riskNode",
  riskNode
);

workflow.addNode(
  "decisionNode",
  decisionNode
);

workflow.addEdge(
  START,
  "researchNode"
);

workflow.addEdge(
  "researchNode",
  "financialNode"
);

workflow.addEdge(
  "financialNode",
  "newsNode"
);

workflow.addEdge(
  "newsNode",
  "riskNode"
);

workflow.addEdge(
  "riskNode",
  "decisionNode"
);

workflow.addEdge(
  "decisionNode",
  END
);

export const investmentGraph =
  workflow.compile();