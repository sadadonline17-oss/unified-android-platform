import 'package:flutter/material.dart';

class ModelSelectorWidget extends StatelessWidget {
  const ModelSelectorWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      height: 48,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('Current Model:'),
          DropdownButton<String>(
            value: 'llama3',
            items: const [
              DropdownMenuItem(value: 'llama3', child: Text('Llama 3 (Local)')),
              DropdownMenuItem(value: 'phi3', child: Text('Phi 3 (Local)')),
              DropdownMenuItem(value: 'qwen2.5-coder', child: Text('Qwen Coder (Cloud)')),
            ],
            onChanged: (val) {},
          ),
        ],
      ),
    );
  }
}
