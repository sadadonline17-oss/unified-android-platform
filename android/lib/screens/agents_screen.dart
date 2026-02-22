import 'package:flutter/material.dart';
import '../widgets/agent_card.dart';

class AgentsScreen extends StatelessWidget {
  const AgentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Agents Marketplace'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          AgentCardWidget(name: 'general-chat', status: 'Running'),
          AgentCardWidget(name: 'codex-style', status: 'Stopped'),
          AgentCardWidget(name: 'claude-code', status: 'Stopped'),
        ],
      ),
    );
  }
}
