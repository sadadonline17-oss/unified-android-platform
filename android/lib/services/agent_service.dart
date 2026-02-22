import 'package:http/http.dart' as http;

class AgentService {
  final String gatewayUrl = 'http://localhost:3000';

  Future<bool> startAgent(String name) async {
    final response = await http.post(Uri.parse('\$gatewayUrl/agent/start'), body: {'name': name});
    return response.statusCode == 200;
  }

  Future<bool> stopAgent(String name) async {
    final response = await http.post(Uri.parse('\$gatewayUrl/agent/stop'), body: {'name': name});
    return response.statusCode == 200;
  }
}
