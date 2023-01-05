// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { Construct } from "constructs";
import { App, TerraformOutput, TerraformStack } from "cdktf";
import * as fs from "fs";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { KeyPair } from "@cdktf/provider-aws/lib/key-pair";
import { Instance } from "@cdktf/provider-aws/lib/instance";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pubKey = fs.readFileSync("yourkey.pub", "utf8");
    new AwsProvider(this, "aws", {
      region: "us-west-2",
    });

    const keyPair = new KeyPair(this, "yourkeypair", {
      keyName: "xxxxxxx",
      publicKey: pubKey,
    });

    const machine = new Instance(this, "yournameinstance", {
      ami: "youramiforregion",
      instanceType: "t2.micro",
      keyName: keyPair.keyName,
    });

    new TerraformOutput(this, "public_ip", {
      value: machine.publicIp,
    })
  }
}

const app = new App();
new MyStack(app, "yournameinstance");
app.synth();
