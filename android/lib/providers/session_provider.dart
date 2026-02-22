import 'package:flutter/material.dart';
import '../models/session_model.dart';

class SessionProvider with ChangeNotifier {
  final List<SessionModel> _sessions = [];

  List<SessionModel> get sessions => _sessions;

  void addSession(SessionModel session) {
    _sessions.add(session);
    notifyListeners();
  }

  void removeSession(String id) {
    _sessions.removeWhere((s) => s.id == id);
    notifyListeners();
  }
}
