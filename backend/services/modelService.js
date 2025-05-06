import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model;

export const loadModel = async () => {
  if (!model) {
    model = await mobilenet.load({ version: 2, alpha: 1 });
    console.log('MobileNetV2 loaded');
  }
  return model;
};

export const classifyImage = async buffer => {
  const model = await loadModel();

  const inputTensor = tf.tidy(() => {
    return tf.node.decodeImage(buffer, 3).resizeNearestNeighbor([224, 224]).toFloat().expandDims(0);
  });

  const predictions = await model.classify(inputTensor);
  inputTensor.dispose();

  return predictions[0];
};
