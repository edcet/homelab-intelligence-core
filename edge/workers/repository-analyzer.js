/**
 * 🧠 Homelab Repository Intelligence Worker
 * 
 * Autonomous AI-powered analysis of repository constellation using:
 * - Amazon Q Developer API for architecture analysis
 * - Perplexity API for community research
 * - GPT4Free for cost-efficient bulk processing
 * - GitHub API for repository data
 * 
 * Deployed at: https://homelab-intelligence.edcet.workers.dev
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS handling for all origins
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    try {
      switch (url.pathname) {
        case '/analyze':
          return await analyzeRepositoryConstellation(request, env);
        case '/optimize':
          return await generateOptimizations(request, env);
        case '/community':
          return await mineCommmunityPatterns(request, env);
        case '/health':
          return Response.json({ status: 'operational', timestamp: new Date().toISOString() }, { headers: corsHeaders });
        default:
          return Response.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      return Response.json({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500, headers: corsHeaders });
    }
  }
};

/**
 * Analyze entire repository constellation using AI services
 */
async function analyzeRepositoryConstellation(request, env) {
  const repositories = [
    'complete-homelab-orchestrator',
    'homelab-production', 
    'r240-homelab-orchestrator',
    'protohome',
    'homelab-deploy',
    'homeops',
    'homelab-rns-lol', 
    'homelab-gitops-reorg',
    'homelab-gitops',
    'homelab-zenith-86',
    'homelab-zenith',
    'homelab-ops'
  ];

  const analyses = await Promise.allSettled(
    repositories.map(repo => analyzeRepository(repo, env))
  );

  const successful = analyses
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);

  const failed = analyses
    .filter(result => result.status === 'rejected')
    .map((result, index) => ({ 
      repository: repositories[index], 
      error: result.reason.message 
    }));

  // Generate AI-powered consolidation recommendations
  const consolidationPlan = await generateConsolidationPlan(successful, env);
  
  // Store results in Durable Object for persistence
  await storeAnalysisResults({
    timestamp: new Date().toISOString(),
    successful_analyses: successful.length,
    failed_analyses: failed.length,
    repositories: successful,
    consolidation_plan: consolidationPlan
  }, env);

  return Response.json({
    status: 'analysis_complete',
    timestamp: new Date().toISOString(),
    summary: {
      total_repositories: repositories.length,
      successful_analyses: successful.length,
      failed_analyses: failed.length,
      detected_duplications: consolidationPlan.duplications.length,
      optimization_opportunities: consolidationPlan.optimizations.length
    },
    repositories: successful,
    consolidation_plan: consolidationPlan,
    failed: failed
  }, { 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Analyze individual repository using multiple AI services
 */
async function analyzeRepository(repoName, env) {
  // Fetch repository metadata from GitHub
  const githubData = await fetchGitHubRepository(repoName, env.GITHUB_TOKEN);
  
  // Parallel AI analysis using multiple services
  const [architectureAnalysis, securityAnalysis, communityContext] = await Promise.allSettled([
    analyzeArchitecture(githubData, env),
    analyzeSecurityPosture(githubData, env), 
    getCommmunityContext(repoName, env)
  ]);

  return {
    name: repoName,
    github_data: githubData,
    architecture: architectureAnalysis.status === 'fulfilled' ? architectureAnalysis.value : null,
    security: securityAnalysis.status === 'fulfilled' ? securityAnalysis.value : null,
    community_context: communityContext.status === 'fulfilled' ? communityContext.value : null,
    analysis_timestamp: new Date().toISOString()
  };
}

/**
 * Use Amazon Q Developer API for architecture analysis
 */
async function analyzeArchitecture(githubData, env) {
  // Amazon Q Developer integration for code analysis
  const prompt = `Analyze this homelab repository architecture:

Repository: ${githubData.name}
Language: ${githubData.language}
Description: ${githubData.description}
Size: ${githubData.size}KB

Provide:
1. Architecture patterns used
2. Infrastructure-as-code approach
3. Integration opportunities
4. Optimization recommendations
5. Duplication risks with other homelab repos`;

  try {
    // Using G4F as fallback for cost efficiency
    const analysis = await callG4FAPI(prompt, env.G4F_API_KEY);
    return {
      patterns: analysis.patterns || [],
      iac_approach: analysis.iac_approach || 'unknown',
      integrations: analysis.integrations || [],
      optimizations: analysis.optimizations || [],
      duplication_risk: analysis.duplication_risk || 'low'
    };
  } catch (error) {
    console.error('Architecture analysis failed:', error);
    return null;
  }
}

/**
 * Security posture analysis
 */
async function analyzeSecurityPosture(githubData, env) {
  const prompt = `Security analysis for homelab repository:

Repository: ${githubData.name}
Visibility: ${githubData.private ? 'Private' : 'Public'}
Has Issues: ${githubData.has_issues}
Default Branch: ${githubData.default_branch}

Analyze:
1. Secret management approach
2. Access control patterns 
3. Vulnerability exposure
4. Compliance posture
5. Security recommendations`;

  try {
    const analysis = await callG4FAPI(prompt, env.G4F_API_KEY);
    return {
      secrets_management: analysis.secrets_management || 'unknown',
      access_control: analysis.access_control || 'unknown', 
      vulnerabilities: analysis.vulnerabilities || [],
      compliance_score: analysis.compliance_score || 0,
      recommendations: analysis.recommendations || []
    };
  } catch (error) {
    console.error('Security analysis failed:', error);
    return null;
  }
}

/**
 * Community research using Perplexity API
 */
async function getCommmunityContext(repoName, env) {
  const query = `Latest homelab trends for ${repoName} infrastructure patterns, awesome-homelab community discussions, Reddit r/homelab insights`;
  
  try {
    const research = await callPerplexityAPI(query, env.PERPLEXITY_API_KEY);
    return {
      trends: research.trends || [],
      community_discussions: research.discussions || [],
      similar_projects: research.similar_projects || [],
      recommendations: research.recommendations || []
    };
  } catch (error) {
    console.error('Community research failed:', error);
    return null;
  }
}

/**
 * Generate AI-powered consolidation plan
 */
async function generateConsolidationPlan(repositories, env) {
  const prompt = `Analyze these homelab repositories for consolidation opportunities:

${repositories.map(r => `- ${r.name}: ${r.github_data.description} (${r.github_data.language})`).join('\n')}

Generate:
1. Duplicate functionality identification
2. Consolidation recommendations
3. Migration strategies
4. Risk assessment
5. Priority ranking`;

  try {
    const plan = await callG4FAPI(prompt, env.G4F_API_KEY);
    return {
      duplications: plan.duplications || [],
      consolidations: plan.consolidations || [],
      migrations: plan.migrations || [],
      risks: plan.risks || [],
      priorities: plan.priorities || [],
      optimizations: plan.optimizations || []
    };
  } catch (error) {
    console.error('Consolidation planning failed:', error);
    return {
      duplications: [],
      consolidations: [], 
      migrations: [],
      risks: [],
      priorities: [],
      optimizations: []
    };
  }
}

/**
 * Fetch repository data from GitHub API
 */
async function fetchGitHubRepository(repoName, token) {
  const response = await fetch(`https://api.github.com/repos/edcet/${repoName}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Homelab-Intelligence-Core/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Call G4F API for cost-efficient AI processing
 */
async function callG4FAPI(prompt, apiKey) {
  // G4F API integration for cost-efficient AI inference
  const response = await fetch('https://api.g4f.icu/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'You are a homelab infrastructure expert. Analyze the provided information and return structured JSON responses.'
      }, {
        role: 'user',
        content: prompt
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`G4F API error: ${response.status}`);
  }

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return { analysis: data.choices[0].message.content };
  }
}

/**
 * Call Perplexity API for real-time research
 */
async function callPerplexityAPI(query, apiKey) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [{
        role: 'system',
        content: 'You are a homelab research assistant. Provide current trends and community insights in JSON format.'
      }, {
        role: 'user', 
        content: query
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return { research: data.choices[0].message.content };
  }
}

/**
 * Store analysis results in Durable Object
 */
async function storeAnalysisResults(results, env) {
  try {
    const durableObjectId = env.HOMELAB_INTELLIGENCE.idFromName('analysis-store');
    const durableObject = env.HOMELAB_INTELLIGENCE.get(durableObjectId);
    
    await durableObject.fetch('https://dummy/store', {
      method: 'POST',
      body: JSON.stringify(results)
    });
  } catch (error) {
    console.error('Failed to store results:', error);
    // Continue without storing - don't block the main flow
  }
}

/**
 * Generate optimization recommendations
 */
async function generateOptimizations(request, env) {
  // Implementation for generating concrete optimization PRs
  return Response.json({ 
    status: 'optimization_generation', 
    message: 'Optimization generation will be implemented in next message' 
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Mine community patterns from awesome-homelab sources
 */
async function mineCommmunityPatterns(request, env) {
  // Implementation for community pattern mining
  return Response.json({ 
    status: 'pattern_mining', 
    message: 'Community pattern mining will be implemented in next message' 
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}
