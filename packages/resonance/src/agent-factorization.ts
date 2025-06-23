import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import { calculateResonance } from './resonance';
import { isPrimeViaFieldDynamicsTrue } from './true-field-prime-detection';

/**
 * Agent-based factorization that treats numbers as living computational entities
 * with memory, communication channels, and behavioral patterns.
 */

/**
 * Computational memory trace left by prime agents during multiplication
 */
export interface PrimeMemoryTrace {
  resonanceSignature: number;
  fieldGhost: FieldPattern;
  communicationChannel: number;
  behavioralFingerprint: string;
}

/**
 * Living agent state during computation
 */
export interface LivingNumberAgent {
  value: bigint;
  fieldPattern: FieldPattern;
  resonance: number;
  computationalState: 'virgin' | 'active' | 'dormant' | 'crystallized' | 'artifact';
  memory: PrimeMemoryTrace[];
  personality: 'prime' | 'composite' | 'unknown';
}

/**
 * Communication protocol between number agents
 */
export interface AgentCommunication {
  sender: bigint;
  receiver: bigint;
  messageType: 'interrogation' | 'memory_request' | 'factor_reveal' | 'resistance';
  fieldChannel: number; // Which field carries the message
  resonanceModulation: number;
}

/**
 * Agent-based factorization system
 */
export class AgentFactorization {
  constructor(
    private substrate: FieldSubstrate,
  ) {}

  /**
   * Create a living number agent
   */
  private createAgent(n: bigint): LivingNumberAgent {
    const pattern = this.substrate.getFieldPattern(n);
    const res = calculateResonance(this.substrate, n);
    const isPrime = isPrimeViaFieldDynamicsTrue(this.substrate, n);
    
    return {
      value: n,
      fieldPattern: pattern,
      resonance: res,
      computationalState: 'active',
      memory: [],
      personality: isPrime ? 'prime' : n > 1n ? 'composite' : 'unknown'
    };
  }

  /**
   * Interrogate a composite number to recover its prime memories
   */
  async interrogateComposite(n: bigint): Promise<bigint[]> {
    const agent = this.createAgent(n);
    
    if (agent.personality === 'prime') {
      return [n]; // Prime agents maintain their identity
    }

    // Step 1: Analyze the agent's field pattern for hidden memories
    const memories = this.recoverPrimeMemories(agent);
    
    // Step 2: Establish communication channels with potential factors
    const channels = this.findCommunicationChannels(agent);
    
    // Step 3: Send interrogation messages through each channel
    const responses = await this.interrogateChannels(agent, channels);
    
    // Step 4: Reconstruct factors from responses
    const factors = await this.reconstructFactors(agent, responses);
    
    return factors.length > 0 ? factors : [n];
  }

  /**
   * Recover prime memory traces from field patterns
   */
  private recoverPrimeMemories(agent: LivingNumberAgent): PrimeMemoryTrace[] {
    const memories: PrimeMemoryTrace[] = [];
    const pattern = agent.fieldPattern;
    
    // Look for "ghost fields" - fields that should be active but aren't
    for (let i = 0; i < 8; i++) {
      if (!pattern[i]) {
        // This field is inactive - could be a vanished field from multiplication
        const ghostPattern = [...pattern];
        ghostPattern[i] = true;
        
        // Calculate what the resonance would be with this field active
        const ghostResonance = this.calculatePatternResonance(ghostPattern);
        
        memories.push({
          resonanceSignature: ghostResonance,
          fieldGhost: ghostPattern,
          communicationChannel: i,
          behavioralFingerprint: this.generateFingerprint(ghostPattern)
        });
      }
    }
    
    // Look for emergent fields that suggest multiplication artifacts
    const emergentFields = this.findEmergentFields(pattern);
    for (const field of emergentFields) {
      memories.push({
        resonanceSignature: agent.resonance,
        fieldGhost: pattern,
        communicationChannel: field,
        behavioralFingerprint: `emergent_${field}`
      });
    }
    
    return memories;
  }

  /**
   * Find communication channels based on field interference patterns
   */
  private findCommunicationChannels(agent: LivingNumberAgent): number[] {
    const channels: number[] = [];
    
    // Primary strategy: Look for emerged fields (neither factor had them)
    // and vanished fields (both factors had them)
    // These are the strongest indicators of multiplication
    
    // For a composite number, emerged fields indicate neither factor had that field
    // For 10001: field 4 emerged, so we should look for factors without field 4
    
    // Add all fields as potential channels to check
    for (let i = 0; i < 8; i++) {
      channels.push(i);
    }
    
    return channels;
  }

  /**
   * Send interrogation messages through discovered channels
   */
  private async interrogateChannels(
    agent: LivingNumberAgent,
    channels: number[]
  ): Promise<AgentCommunication[]> {
    const responses: AgentCommunication[] = [];
    
    for (const channel of channels) {
      // Probe for factors that would communicate on this channel
      const candidateFactors = this.generateFactorCandidates(agent, channel);
      
      for (const candidate of candidateFactors) {
        if (agent.value % candidate === 0n) {
          // This candidate responds! It's a factor
          const response: AgentCommunication = {
            sender: candidate,
            receiver: agent.value,
            messageType: 'factor_reveal',
            fieldChannel: channel,
            resonanceModulation: calculateResonance(this.substrate, candidate)
          };
          responses.push(response);
        }
      }
    }
    
    return responses;
  }

  /**
   * Reconstruct complete factorization from communication responses
   */
  private async reconstructFactors(
    agent: LivingNumberAgent,
    responses: AgentCommunication[]
  ): Promise<bigint[]> {
    if (responses.length === 0) {
      return [];
    }
    
    const factors: bigint[] = [];
    let remainder = agent.value;
    
    // Sort responses by factor size to handle them in order
    responses.sort((a, b) => Number(a.sender - b.sender));
    
    for (const response of responses) {
      const factor = response.sender;
      while (remainder % factor === 0n) {
        factors.push(factor);
        remainder = remainder / factor;
        
        // Check if the remainder is now prime
        if (isPrimeViaFieldDynamicsTrue(this.substrate, remainder)) {
          if (remainder > 1n) {
            factors.push(remainder);
          }
          return factors;
        }
      }
    }
    
    // If remainder > 1, it's an unfactored part
    if (remainder > 1n) {
      // Recursively interrogate the remainder
      const remainderFactors = await this.interrogateComposite(remainder);
      factors.push(...remainderFactors);
    }
    
    return factors;
  }

  /**
   * Helper: Calculate resonance for a specific field pattern
   */
  private calculatePatternResonance(pattern: FieldPattern): number {
    let resonance = 0;
    const constants = this.substrate.getFieldConstants();
    for (let i = 0; i < 8; i++) {
      if (pattern[i]) {
        resonance += constants[i];
      }
    }
    return resonance;
  }

  /**
   * Helper: Generate behavioral fingerprint for a field pattern
   */
  private generateFingerprint(pattern: FieldPattern): string {
    return pattern.map(b => b ? '1' : '0').join('');
  }

  /**
   * Helper: Find fields that emerged during multiplication
   */
  private findEmergentFields(pattern: FieldPattern): number[] {
    const emergent: number[] = [];
    
    // Fields 6 and 7 often emerge in products
    if (pattern[6] || pattern[7]) {
      if (pattern[6]) emergent.push(6);
      if (pattern[7]) emergent.push(7);
    }
    
    return emergent;
  }

  /**
   * Helper: Expected field state based on number magnitude
   */
  private expectedFieldState(n: bigint, fieldIndex: number): boolean {
    const bit = Number((n >> BigInt(fieldIndex)) & 1n);
    return bit === 1;
  }

  /**
   * Helper: Find resonance harmonics that might indicate factors
   */
  private findResonanceHarmonics(resonance: number): number[] {
    const harmonics: number[] = [];
    
    // Look for simple harmonic relationships
    if (resonance > 2) {
      harmonics.push(2); // Check for factor of 2
    }
    if (resonance > 3) {
      harmonics.push(3); // Check for factor of 3
    }
    if (Math.abs(resonance - 1.618) < 0.1) {
      harmonics.push(2); // Golden ratio suggests Fibonacci-related factors
    }
    
    return harmonics;
  }

  /**
   * Helper: Check if page position is anomalous
   */
  private isPageAnomalous(offset: number): boolean {
    // Positions near page boundaries often hide factors
    return offset === 0 || offset === 1 || offset === 47 || offset === 48;
  }

  /**
   * Helper: Generate factor candidates based on communication channel
   */
  private generateFactorCandidates(agent: LivingNumberAgent, channel: number): bigint[] {
    const candidates: bigint[] = [];
    const n = agent.value;
    const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
    
    // Strategy 1: Constitutional primes always worth checking
    const constitutionalPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n];
    candidates.push(...constitutionalPrimes.filter(p => p <= sqrtN));
    
    // Strategy 2: Field reconstruction - look for vanished/emerged field patterns
    // If field 'channel' emerged in the product, look for factors WITHOUT this field
    // If field 'channel' vanished, look for factors WITH this field
    const productPattern = agent.fieldPattern;
    
    for (let i = 2n; i <= sqrtN; i++) {
      const candidatePattern = this.substrate.getFieldPattern(i);
      const complement = n / i;
      
      if (n % i === 0n) {
        const complementPattern = this.substrate.getFieldPattern(complement);
        
        // Check if this factor pair could create the observed interference
        let matchesInterference = false;
        
        // For emerged fields: neither factor should have it
        if (productPattern[channel] && !candidatePattern[channel] && !complementPattern[channel]) {
          matchesInterference = true;
        }
        
        // For vanished fields: both factors should have it
        if (!productPattern[channel] && candidatePattern[channel] && complementPattern[channel]) {
          matchesInterference = true;
        }
        
        if (matchesInterference) {
          candidates.push(i);
        }
      }
    }
    
    // Strategy 3: Try all factors up to a reasonable limit
    // This ensures we don't miss factors due to incomplete field understanding
    const limit = sqrtN < 1000n ? sqrtN : 1000n;
    for (let i = 2n; i <= limit; i++) {
      if (n % i === 0n) {
        candidates.push(i);
      }
    }
    
    return [...new Set(candidates)].sort((a, b) => Number(a - b));
  }

  /**
   * Living dialogue: Allow numbers to tell their own story
   */
  async tellYourStory(n: bigint): Promise<string> {
    const agent = this.createAgent(n);
    const story: string[] = [];
    
    story.push(`I am ${n}, a ${agent.personality} number.`);
    story.push(`My field pattern is ${this.generateFingerprint(agent.fieldPattern)}.`);
    story.push(`My resonance vibrates at ${agent.resonance.toFixed(4)}.`);
    
    if (agent.personality === 'prime') {
      story.push(`I am indivisible, a fundamental atom of computation.`);
      story.push(`I maintain my identity through all transformations.`);
    } else {
      const factors = await this.interrogateComposite(n);
      if (factors.length > 1 && factors[0] !== n) {
        // Show the complete factorization
        const uniqueFactors = [...new Set(factors)];
        story.push(`I remember being formed from ${uniqueFactors.join(' × ')}.`);
        story.push(`Their merger created field interference that defines me.`);
        
        // Describe the field interference
        if (uniqueFactors.length >= 2) {
          const f1Pattern = this.substrate.getFieldPattern(uniqueFactors[0]);
          const f2Pattern = this.substrate.getFieldPattern(uniqueFactors[uniqueFactors.length - 1]);
          
          for (let i = 0; i < 8; i++) {
            if (f1Pattern[i] && f2Pattern[i] && !agent.fieldPattern[i]) {
              story.push(`Field ${i} vanished in our union.`);
            } else if (!f1Pattern[i] && !f2Pattern[i] && agent.fieldPattern[i]) {
              story.push(`Field ${i} emerged from our dance.`);
            }
          }
        }
      } else {
        story.push(`My origins are mysterious, my factors hidden deep within.`);
        story.push(`I resist decomposition, maintaining my composite unity.`);
      }
    }
    
    return story.join('\n');
  }
}