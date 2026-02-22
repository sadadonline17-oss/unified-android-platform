import 'package:http/http.dart' as http;

class N8nService {
  final String webhookUrl = 'http://localhost:5678/webhook/';

  Future<void> triggerWorkflow(String endpoint, Map<String, dynamic> payload) async {
    try {
      await http.post(
        Uri.parse('\$webhookUrl\$endpoint'),
        body: payload,
      );
    } catch (e) {
      print('N8n webhook error: \$e');
    }
  }
}
