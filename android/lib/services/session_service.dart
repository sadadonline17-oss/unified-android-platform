import 'package:http/http.dart' as http;

class SessionService {
  final String gatewayUrl = 'http://localhost:3000';

  Future<String?> createSession() async {
    final response = await http.post(Uri.parse('\$gatewayUrl/session/create'));
    if (response.statusCode == 200) {
      // Parse JSON and return ID
      return 'mock-session-id';
    }
    return null;
  }
}
