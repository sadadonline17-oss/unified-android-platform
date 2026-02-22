import 'package:flutter/material.dart';
import '../models/agent_model.dart';

class AgentProvider with ChangeNotifier {
  final List<AgentModel> _agents = [];

  List<AgentModel> get agents => _agents;

  void fetchAgents() {
    // Stub for fetching agents from Gateway API
    _agents.clear();
    _agents.add(AgentModel(id: '1', name: 'general-chat', status: 'Running', requiredModel: 'llama3'));
    notifyListeners();
  }
}
