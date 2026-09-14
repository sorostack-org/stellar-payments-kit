export interface Proposal {
  id: string;
  title: string;
  description: string;
  options: string[];
  votes: Record<string, number>;
  startTime: number;
  endTime: number;
  quorum: number;
  executed: boolean;
}

export function createProposal(
  title: string,
  description: string,
  options: string[],
  durationMs: number,
  quorum: number,
): Proposal {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    options,
    votes: Object.fromEntries(options.map((o) => [o, 0])),
    startTime: Date.now(),
    endTime: Date.now() + durationMs,
    quorum,
    executed: false,
  };
}

export function castVote(proposal: Proposal, option: string, weight: number): Proposal {
  if (Date.now() > proposal.endTime) throw new Error("Voting period ended");
  if (!proposal.options.includes(option)) throw new Error("Invalid option");
  return {
    ...proposal,
    votes: {
      ...proposal.votes,
      [option]: (proposal.votes[option] ?? 0) + weight,
    },
  };
}

export function getWinningOption(proposal: Proposal): string | null {
  const totalVotes = Object.values(proposal.votes).reduce((a, b) => a + b, 0);
  if (totalVotes < proposal.quorum) return null;
  return Object.entries(proposal.votes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function isProposalActive(proposal: Proposal): boolean {
  const now = Date.now();
  return now >= proposal.startTime && now <= proposal.endTime;
}
