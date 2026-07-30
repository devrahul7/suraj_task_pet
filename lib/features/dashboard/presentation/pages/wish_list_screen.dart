import 'package:flutter/material.dart';

class WishListScreen extends StatelessWidget {
  const WishListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Wish List Screen"),
      centerTitle: true,),
      body: Center(child: Text("this is Wish List Screen")),
    );
  }
}