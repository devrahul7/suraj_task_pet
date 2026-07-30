import 'package:flutter/material.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Explore Screen"),
      centerTitle: true,),
      body: Center(child: Text("This is Explore Screen")),
    );
  }
}