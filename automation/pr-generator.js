/**
 * 🤖 Autonomous PR Generation System
 * 
 * Creates optimization PRs across the entire repository constellation based on:
 * - AI analysis results from edge intelligence layer
 * - Community pattern mining from awesome-homelab sources  
 * - Duplication detection and consolidation opportunities
 * - Security and performance optimizations
 * 
 * Integrates with GitHub API for automated PR creation with full context
 */

import { Octokit } from '@octokit/rest';

/**
 * Repository constellation with their specific optimization contexts
 */
const REPOSITORY_CONSTELLATION = {
  'complete-homelab-orchestrator': {
    type: 'service-mesh',
    language: 'TypeScript',
    focus: 'Pangolin/Newt/Gerbil/Badger optimization',
    visibility: 'public'
  },
  'homelab-production': {
    type: 'infrastructure',
    language: 'TypeScript', 
    focus: 'Pulumi stack consolidation',
    visibility: 'private'
  },
  'r240-homelab-orchestrator': {
    type: 'hardware-automation',
    language: 'Shell',
    focus: 'Dell R240 Redfish optimization', 
    visibility: 'private'
  },
  'protohome': {
    type: 'ai-native',
    language: 'Shell',
    focus: 'Zero-touch patterns',
    visibility: 'public'
  },
  'homelab-deploy': {
    type: 'deployment',
    language: 'TypeScript',
    focus: 'Deployment tooling consolidation',
    visibility: 'public'
  },
  'homeops': {
    type: 'operations',
    language: 'TypeScript',
    focus: 'Multi-cloud orchestration',
    visibility: 'private'
  },
  'homelab-gitops': {
    type: 'gitops',
    language: 'Shell',
    focus: 'GitOps workflow optimization',
    visibility: 'private'
  },
  'homelab-zenith-86': {
    type: 'infrastructure-advanced',
    language: 'TypeScript',
    focus: 'Advanced pattern consolidation',
    visibility: 'private'
  }
};

/**
 * AI-powered PR generation based on analysis results
 */
export class AutonomousPRGenerator {
  constructor(githubToken, aiServices) {
    this.octokit = new Octokit({ auth: githubToken });
    this.ai = aiServices;
    this.owner = 'edcet';
  }

  /**
   * Generate optimization PRs across entire constellation
   */
  async generateConstellationOptimizations(analysisResults) {
    const prResults = [];
    
    for (const [repoName, repoConfig] of Object.entries(REPOSITORY_CONSTELLATION)) {
      try {
        const repoAnalysis = analysisResults.repositories.find(r => r.name === repoName);
        if (!repoAnalysis) continue;

        // Generate multiple PR types for each repository
        const prTypes = await this.identifyPROpportunities(repoAnalysis, repoConfig);
        
        for (const prType of prTypes) {
          const pr = await this.generateOptimizationPR(repoName, prType, repoAnalysis);
          if (pr) {
            prResults.push({ repository: repoName, pr });
          }
        }
      } catch (error) {
        console.error(`Failed to generate PRs for ${repoName}:`, error);
        prResults.push({ 
          repository: repoName, 
          error: error.message 
        });
      }
    }

    return prResults;
  }

  /**
   * Identify PR opportunities using AI analysis
   */
  async identifyPROpportunities(repoAnalysis, repoConfig) {
    const opportunities = [];
    
    // Security optimization opportunities
    if (repoAnalysis.security?.vulnerabilities?.length > 0) {
      opportunities.push({
        type: 'security-hardening',
        priority: 'high',
        impact: 'security improvement'
      });
    }

    // Architecture consolidation opportunities
    if (repoAnalysis.architecture?.duplication_risk === 'high') {
      opportunities.push({
        type: 'duplication-removal',
        priority: 'medium', 
        impact: 'code consolidation'
      });
    }

    // Performance optimization opportunities
    if (repoAnalysis.architecture?.optimizations?.length > 0) {
      opportunities.push({
        type: 'performance-optimization',
        priority: 'medium',
        impact: 'performance improvement'
      });
    }

    // GitHub Actions workflow optimization
    opportunities.push({
      type: 'ci-enhancement', 
      priority: 'low',
      impact: 'workflow automation'
    });

    // Intelligence integration
    opportunities.push({
      type: 'intelligence-integration',
      priority: 'high',
      impact: 'AI-native capabilities'
    });

    return opportunities.slice(0, 2); // Limit to 2 PRs per repository to avoid spam
  }

  /**
   * Generate specific optimization PR
   */
  async generateOptimizationPR(repoName, opportunity, repoAnalysis) {
    const branchName = `intelligence/optimize-${opportunity.type}-${Date.now()}`;
    const prTitle = this.generatePRTitle(opportunity, repoName);
    const prBody = await this.generatePRBody(opportunity, repoAnalysis, repoName);
    const files = await this.generateOptimizationFiles(opportunity, repoAnalysis, repoName);

    try {
      // Create branch
      const defaultBranch = await this.getDefaultBranch(repoName);
      await this.createBranch(repoName, branchName, defaultBranch.sha);

      // Create/update files
      for (const file of files) {
        await this.createOrUpdateFile(repoName, branchName, file);
      }

      // Create pull request
      const pr = await this.octokit.pulls.create({
        owner: this.owner,
        repo: repoName,
        title: prTitle,
        body: prBody,
        head: branchName,
        base: defaultBranch.name,
        draft: false
      });

      // Add labels
      await this.octokit.issues.addLabels({
        owner: this.owner,
        repo: repoName,
        issue_number: pr.data.number,
        labels: ['intelligence', 'automation', opportunity.type, `priority-${opportunity.priority}`]
      });

      return {
        number: pr.data.number,
        url: pr.data.html_url,
        title: prTitle,
        type: opportunity.type
      };
    } catch (error) {
      console.error(`Failed to create PR for ${repoName}:`, error);
      return null;
    }
  }

  /**
   * Generate PR title based on optimization type
   */
  generatePRTitle(opportunity, repoName) {
    const titles = {
      'security-hardening': `🔒 Autonomous Security Hardening`,
      'duplication-removal': `🧠 AI-Detected Duplication Consolidation`,
      'performance-optimization': `⚡ Performance Optimization via Intelligence Analysis`,
      'ci-enhancement': `📈 Enhanced CI/CD with Intelligence Integration`,
      'intelligence-integration': `🧠 Homelab Intelligence Platform Integration`
    };
    
    return titles[opportunity.type] || `🤖 Autonomous Optimization`;
  }

  /**
   * Generate comprehensive PR body with AI analysis context
   */
  async generatePRBody(opportunity, repoAnalysis, repoName) {
    const analysis = repoAnalysis.architecture || {};
    const security = repoAnalysis.security || {};
    const community = repoAnalysis.community_context || {};

    let body = `## 🧠 AI-Generated Optimization\n\n`;
    body += `**Generated by**: [Homelab Intelligence Core](https://github.com/edcet/homelab-intelligence-core)\n`;
    body += `**Analysis Timestamp**: ${repoAnalysis.analysis_timestamp}\n`;
    body += `**Optimization Type**: ${opportunity.type}\n`;
    body += `**Priority**: ${opportunity.priority}\n`;
    body += `**Expected Impact**: ${opportunity.impact}\n\n`;

    // Add specific optimization context
    switch (opportunity.type) {
      case 'security-hardening':
        body += `### 🔒 Security Improvements\n\n`;
        body += `**Detected Issues**: ${security.vulnerabilities?.length || 0}\n`;
        body += `**Current Compliance Score**: ${security.compliance_score || 'Unknown'}\n`;
        if (security.recommendations?.length > 0) {
          body += `\n**Recommendations**:\n`;
          security.recommendations.forEach(rec => {
            body += `- ${rec}\n`;
          });
        }
        break;

      case 'duplication-removal':
        body += `### 🧠 Duplication Analysis\n\n`;
        body += `**Duplication Risk**: ${analysis.duplication_risk}\n`;
        body += `**Detected Patterns**: ${analysis.patterns?.join(', ') || 'Various'}\n`;
        if (analysis.optimizations?.length > 0) {
          body += `\n**Consolidation Opportunities**:\n`;
          analysis.optimizations.forEach(opt => {
            body += `- ${opt}\n`;
          });
        }
        break;

      case 'intelligence-integration':
        body += `### 🧠 Intelligence Platform Integration\n\n`;
        body += `This PR integrates your repository with the [Homelab Intelligence Core](https://github.com/edcet/homelab-intelligence-core) platform for:\n\n`;
        body += `- 📏 **Continuous Architecture Analysis**\n`;
        body += `- 🔒 **Automated Security Monitoring**\n`;
        body += `- ⚡ **Performance Optimization Recommendations**\n`;
        body += `- 🌍 **Community Pattern Integration**\n`;
        body += `- 🤖 **Autonomous PR Generation**\n\n`;
        break;
    }

    // Add community context if available
    if (community.trends?.length > 0) {
      body += `### 🌍 Community Insights\n\n`;
      community.trends.forEach(trend => {
        body += `- ${trend}\n`;
      });
      body += `\n`;
    }

    body += `### 📈 Rollback Plan\n\n`;
    body += `This PR can be safely reverted using: \`git revert <commit-sha>\`\n\n`;
    
    body += `### ✅ Testing\n\n`;
    body += `- [ ] CI passes\n`;
    body += `- [ ] No breaking changes\n`;
    body += `- [ ] Documentation updated\n`;
    body += `- [ ] Intelligence integration verified\n\n`;
    
    body += `---\n\n`;
    body += `*This PR was autonomously generated by the Homelab Intelligence Platform. Review carefully before merging.*`;

    return body;
  }

  /**
   * Generate optimization files based on opportunity type
   */
  async generateOptimizationFiles(opportunity, repoAnalysis, repoName) {
    const files = [];
    const repoConfig = REPOSITORY_CONSTELLATION[repoName];

    switch (opportunity.type) {
      case 'intelligence-integration':
        // Add intelligence webhook integration
        files.push({
          path: '.github/workflows/intelligence.yml',
          content: this.generateIntelligenceWorkflow(repoName, repoConfig)
        });
        
        // Add intelligence configuration
        files.push({
          path: '.intelligence/config.json',
          content: JSON.stringify({
            repository: repoName,
            type: repoConfig.type,
            analysis_enabled: true,
            optimization_enabled: true,
            community_learning: true,
            auto_pr_enabled: true,
            webhook_url: 'https://homelab-intelligence.edcet.workers.dev/webhook'
          }, null, 2)
        });
        break;

      case 'ci-enhancement':
        // Enhanced CI workflow with intelligence integration
        files.push({
          path: '.github/workflows/ci-enhanced.yml', 
          content: this.generateEnhancedCIWorkflow(repoName, repoConfig)
        });
        break;

      case 'security-hardening':
        // Security policy and workflow
        files.push({
          path: '.github/workflows/security.yml',
          content: this.generateSecurityWorkflow(repoName)
        });
        break;
    }

    return files;
  }

  /**
   * Generate intelligence integration workflow
   */
  generateIntelligenceWorkflow(repoName, repoConfig) {
    return `name: 🧠 Homelab Intelligence Integration

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  schedule:
    - cron: '0 6 * * *' # Daily analysis at 6 AM UTC

env:
  INTELLIGENCE_WEBHOOK: https://homelab-intelligence.edcet.workers.dev

jobs:
  intelligence-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        
      - name: 🧠 Trigger Intelligence Analysis
        run: |
          curl -X POST "$INTELLIGENCE_WEBHOOK/analyze" \
            -H "Content-Type: application/json" \
            -d '{
              "repository": "${repoName}",
              "type": "${repoConfig.type}",
              "trigger": "github-action",
              "commit": "${{ github.sha }}",
              "branch": "${{ github.ref_name }}"
            }'
            
      - name: 📋 Generate Intelligence Report
        run: |
          echo "## 🧠 Intelligence Analysis Complete" >> $GITHUB_STEP_SUMMARY
          echo "Repository: ${repoName}" >> $GITHUB_STEP_SUMMARY
          echo "Type: ${repoConfig.type}" >> $GITHUB_STEP_SUMMARY
          echo "Analysis triggered at: $(date)" >> $GITHUB_STEP_SUMMARY
          echo "View full results: [Intelligence Dashboard](https://homelab-intelligence.edcet.workers.dev)" >> $GITHUB_STEP_SUMMARY

  community-pattern-check:
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule'
    steps:
      - name: 🌍 Check Community Patterns
        run: |
          curl -X POST "$INTELLIGENCE_WEBHOOK/community" \
            -H "Content-Type: application/json" \
            -d '{
              "repository": "${repoName}",
              "check_type": "pattern_mining"
            }'
`;
  }

  /**
   * Generate enhanced CI workflow
   */
  generateEnhancedCIWorkflow(repoName, repoConfig) {
    const language = repoConfig.language.toLowerCase();
    
    let workflow = `name: 📈 Enhanced CI with Intelligence

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
`;

    if (language === 'typescript') {
      workflow += `  typescript-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm run test --if-present
      - run: npm run build --if-present
      
      - name: 🧠 Intelligence Analysis
        run: |
          curl -X POST "https://homelab-intelligence.edcet.workers.dev/analyze" \
            -H "Content-Type: application/json" \
            -d '{
              "repository": "${repoName}", 
              "language": "typescript",
              "context": "ci-run"
            }'
`;
    } else if (language === 'shell') {
      workflow += `  shell-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: ShellCheck
        uses: ludeeus/action-shellcheck@master
        
      - name: 🧠 Intelligence Analysis
        run: |
          curl -X POST "https://homelab-intelligence.edcet.workers.dev/analyze" \
            -H "Content-Type: application/json" \
            -d '{
              "repository": "${repoName}",
              "language": "shell", 
              "context": "ci-run"
            }'
`;
    }

    return workflow;
  }

  /**
   * Generate security workflow
   */
  generateSecurityWorkflow(repoName) {
    return `name: 🔒 Security Analysis

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  schedule:
    - cron: '0 2 * * 1' # Weekly security scan

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy scan results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
          
      - name: 🧠 Intelligence Security Analysis
        run: |
          curl -X POST "https://homelab-intelligence.edcet.workers.dev/analyze" \
            -H "Content-Type: application/json" \
            -d '{
              "repository": "${repoName}",
              "analysis_type": "security",
              "context": "security-scan"
            }'
`;
  }

  /**
   * Helper methods for GitHub API operations
   */
  async getDefaultBranch(repoName) {
    const { data: repo } = await this.octokit.repos.get({
      owner: this.owner,
      repo: repoName
    });
    
    const { data: branch } = await this.octokit.repos.getBranch({
      owner: this.owner,
      repo: repoName,
      branch: repo.default_branch
    });
    
    return {
      name: repo.default_branch,
      sha: branch.commit.sha
    };
  }

  async createBranch(repoName, branchName, baseSha) {
    return await this.octokit.git.createRef({
      owner: this.owner,
      repo: repoName,
      ref: `refs/heads/${branchName}`,
      sha: baseSha
    });
  }

  async createOrUpdateFile(repoName, branch, file) {
    try {
      // Try to get existing file
      const { data: existingFile } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: repoName,
        path: file.path,
        ref: branch
      });
      
      // Update existing file
      return await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: repoName,
        path: file.path,
        message: `🧠 Update ${file.path} via intelligence automation`,
        content: Buffer.from(file.content).toString('base64'),
        sha: existingFile.sha,
        branch
      });
    } catch (error) {
      if (error.status === 404) {
        // Create new file
        return await this.octokit.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: repoName,
          path: file.path,
          message: `🧠 Create ${file.path} via intelligence automation`,
          content: Buffer.from(file.content).toString('base64'),
          branch
        });
      }
      throw error;
    }
  }
}

/**
 * Export for use in edge workers and GitHub Actions
 */
export default AutonomousPRGenerator;
